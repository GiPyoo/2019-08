import { AxiosErrorHandler } from "data/http/api/axiosErrorHandler";
import { Snug } from "core/entity/snug";
import { StatusCodes } from "./status-codes";
import { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { AxiosWrapper } from "./axios-wrapper";
import { ResponseEntity } from "./response/ResponseEntity";

export class SnugApi{
    private axios: AxiosInstance;

    constructor(axios: AxiosWrapper){
        this.axios = axios.getAxios();
    }

    create(input: Snug, userId: number): Promise<ResponseEntity<Snug> | boolean> {
        return this.axios.post(`/api/snugs`, {
            name: input.name,
            description: input.description,
            thumbnail: input.thumbnail,
            userId
        })
        .then((response: AxiosResponse<ResponseEntity<Snug>>) => {
            if (StatusCodes.isCreated(response.status)) {
                return response.data;
            } else {
                return false;
            }
        })
        .catch((error: AxiosError) =>
            AxiosErrorHandler.handleError(
                error,
                `${input.name!} �߰� �������� ����ġ ���� ������ �߻��߽��ϴ�.`
            )
        );
    }
}