import { Snug } from "core/entity/snug";

export interface SnugRepositoryType {
    /**
     * snug�� �����Ѵ�.
     * @param userId snug creator
     */
    create(snug: Snug): Promise<Snug | boolean>;
}
