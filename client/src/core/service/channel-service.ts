import { ChannelRepositoryType } from "core/use-case/channel-repository-type";
import { ChannelModel } from "core/model/channel-model";
import { Channel } from "core/entity/channel";
import { Snug } from "core/entity/snug";
import {ParticipateInfo} from "../entity/participate-info";

/**
 *
 * 채널 비즈니스 로직 처리하는 객체
 *
 * */
export class ChannelService {
  private repository: ChannelRepositoryType;

  constructor(channelRepository: ChannelRepositoryType) {
    this.repository = channelRepository;
  }

  /**
   *
   * 채널 생성
   *
   * @param snugId
   * @param title
   * @param description
   * @param privacy
   * @return boolean 생성 여부
   *
   * */
  async create(
    title: string,
    snugId: string,
    description: string,
    privacy: boolean
  ): Promise<Channel> {
    const channel: ChannelModel = new ChannelModel(title, snugId, description, privacy);
    const satisfaction = await this.isSatisfied(channel);
    if (satisfaction) {
      return this.repository.create(channel);
    }

    return {};
  }

  /**
   *
   * 채널 생성하기 위한 검증
   * @param channel
   *
   * */
  private async isSatisfied(channel: ChannelModel): Promise<boolean> {
    if (channel.isImpossibleFormat()) {
      return false;
    }
    return await this.isNotDuplicated(channel);
  }

  /**
   *
   * 채널명 중복 확인
   * @param channel
   *
   * */
  private async isNotDuplicated(channel: ChannelModel): Promise<boolean> {
    const redundancy = await this.repository.hasByTitleAndSnugId(channel.getTitle(), channel.getSnugId());
    return !redundancy;
  }

  getChannelList(snugId: number): Promise<Channel[] | boolean> {
    const snug: Snug = { id: snugId };
    return this.repository.getChannels(snug);
  }

  getChannelById(channelId: number): Promise<Channel> {
    return this.repository.getChannelById(channelId);
  }

  getParticipatingChannelList(snugId: number): Promise<Channel[] | boolean> {
    const snug: Snug = { id: snugId };
    return this.repository.getParticipatingChannels(snug);
  }

  join(channelId: number): Promise<ParticipateInfo> {
    const channel: Channel = { id: channelId };
    return this.repository.join(channel);
  }

  isInParticipating(snugId: number, channelId: number): Promise<boolean> {
    const snug: Snug = { id: snugId };
    const channel: Channel = { id: channelId };
    return this.repository.isInParticipating(snug, channel);
  }
}
