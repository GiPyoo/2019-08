import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../domain/entity/User";
import {Profile} from "../domain/entity/Profile";

enum Numbers {
  MIN_CHARACTER_DIGIT = 0,
  MAX_CHARACTER_DIGIT = 9,
  MIN_INTEGER_ID = 0,
  MAX_INTEGER_ID = Math.pow(2, 31)
}

/**
 *
 * 한 자리 문자의 0 ~ 9 숫자 범위 포함 여부 확인
 *
 * @param character 0 ~ 9 범위의 한 자리 문자열
 * @return boolean 미포함 true, 포함 false
 *
 * */
export const isOutOfRangeChar = (character: string): boolean => {
  const digit = parseInt(character);
  return !(
    Numbers.MIN_CHARACTER_DIGIT <= digit && digit <= Numbers.MAX_CHARACTER_DIGIT
  );
};

/**
 *
 * 입력받은 문자열이 숫자로만 이루어져 있는 지 확인
 *
 * @param target 문자열
 * @return boolean 모든 문자가 숫자가 아닌 경우 true, 모든 문자가 숫자인 경우 false
 *
 * */
export const hasNotEveryNumber = (target: string): boolean => {
  const DELIMITER = "";
  return target.split(DELIMITER).some(isOutOfRangeChar);
};

/**
 *
 * 빈 문자열, null, undefined 여부 확인
 *
 * @param target 문자열
 * @return boolean 빈 문자열, null, undefined 중 하나인 경우 true, 아닌 경우 false
 *
 * */
export const hasNotValue = (target: string): boolean => {
  return !target;
};

/**
 *
 * 입력받은 문자열의 정수값의 (1 ~ 2^31 - 1) 범위 포함 여부 확인
 *
 * @param target 문자열
 * @return boolean 미포함 true, 포함 false
 *
 * */
export const isOutOfRange = (target: string): boolean => {
  const digits = parseInt(target);
  return !(Numbers.MIN_INTEGER_ID < digits && digits < Numbers.MAX_INTEGER_ID);
};

export const isNumeric = (id: string): void => {
  if (hasNotValue(id) || hasNotEveryNumber(id) || isOutOfRange(id)) {
    throw new Error("Invalid id format. Must be an Number");
  }
};

export const offerTokenInfo = (request: Request): UserInfo => {
  const token = request.headers["auth-token"];
  if (!token) throw new Error("토큰이 존재하지 않습니다.");
  return jwt.verify(token as string, process.env.SECRET_KEY) as UserInfo;
};

export const offerProfileTokenInfo = (request: Request): Profile => {
  const token = request.cookies["profile"];
  if (!token) throw new Error("토큰이 존재하지 않습니다.");
  const decoded = jwt.verify(token as string, process.env.SECRET_KEY);
  return decoded as Profile;
};

export const isVerifyLogined = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const decoded = offerTokenInfo(request);
    await User.findOneOrFail({ where: { email: decoded.email } });
    next();
  } catch (error) {
    next(new Error("가입되지 않은 사용자입니다."));
  }
};

export const isVerifyProfile = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const decoded = offerProfileTokenInfo(request);
    if (typeof decoded != "object") next(new Error("토큰이 잘못 되었습니다."));
    next();
  } catch (error) {
    next(error);
  }
};

export type UserInfo = {
  id: number;
  name: string;
  email: string;
};
