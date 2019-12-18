import {ResponseEntity} from "data/http/api/response/ResponseEntity";
import {ChannelApi} from "data/http/api/channel-api";
import {Channel} from "core/entity/channel";
import {ChannelRepositoryType} from "core/use-case/channel-repository-type";
import {Snug} from "core/entity/snug";
import {hasNotCookie} from "util/cookie";
import {ParticipateInfo} from "core/entity/participate-info";
import {ChannelModel} from "core/model/channel-model";

export class ChannelRepository implements ChannelRepositoryType {
  private api: ChannelApi;

  constructor(api: ChannelApi) {
    this.api = api;
  }

  async create(channelModel: ChannelModel): Promise<Channel> {
    const {channel} = await this.api.create(channelModel);
    return channel;
  }

  async hasByTitleAndSnugId(title: string, snugId: string): Promise<boolean> {
    try {
      const responseEntity = await this.api.findByTitleAndSnugId(title, snugId);
      return !!responseEntity;
    } catch (error) {
      return false;
    }
  }

  async getChannels(snug: Snug): Promise<Channel[] | boolean> {
    try {
      const responseEntity = await this.api.getList(snug);
      if (responseEntity)
        return (responseEntity as ResponseEntity<{ channels: Channel[] }>).payload.channels;
      return false;
    } catch (error) {
      return false;
    }
  }

  async getParticipatingChannels(snug: Snug): Promise<Channel[]> {
    const {channels} = await this.api.getParticipatingList(snug);
    return channels;
  }

  join(channelInfo: Channel): Promise<ParticipateInfo> {
    return this.api.join(channelInfo);
  }

  async getChannelById(channelId: number): Promise<Channel> {
    const {channel} = await this.api.getById(channelId);
    return channel;
  }

  async isInParticipating(snug: Snug, channel: Channel): Promise<boolean> {
    if (hasNotCookie("profile")) {
      throw new Error("프로필 쿠키가 존재하지 않습니다.");
    }
    const channels = await this.getParticipatingChannels(snug);
    if (typeof channels === "boolean") {
      return channels;
    }
    return channels.some(channelParameter => channelParameter.id === channel.id);
  }
}
