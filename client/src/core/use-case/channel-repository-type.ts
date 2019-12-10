import { Channel } from "core/entity/channel";
import { Snug } from "core/entity/snug";

export interface ChannelRepositoryType {
  create(snug: Snug, channel: Channel): Promise<boolean | Channel>;

  hasByTitle(title: string): Promise<boolean>;

  join(channel: Channel): Promise<boolean>;
  
  getChannels(snug: Snug): Promise<Channel[] | boolean>;
}
