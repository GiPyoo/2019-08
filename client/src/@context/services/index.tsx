import { RepositoryDependencies } from "@context/repositories/index";
import { ChannelService } from "core/service/channel-service";
import { PostService } from "core/service/post-service";
import { SnugService } from "core/service/snug-service";
import { AuthService } from "core/service/auth-service";

export class ServiceDependencies {
  readonly channelService: ChannelService;
  readonly postService: PostService;
  readonly snugService: SnugService;
  readonly authService: AuthService;

  constructor(repositories: RepositoryDependencies) {
    this.channelService = new ChannelService(
      repositories.getChatRoom().getChannelRepository()
    );
    this.postService = new PostService(
      repositories.getPosting().getPostRepository()
    );
    this.snugService = new SnugService(
      repositories.getSnug().getSnugRepository()
    );
    this.authService = new AuthService(repositories.getAuth());
  }
}
