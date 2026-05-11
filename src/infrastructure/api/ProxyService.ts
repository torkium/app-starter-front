import { BaseService } from "@/infrastructure/api/BaseService";

export abstract class ProxyService extends BaseService {
  constructor(basePath = "") {
    super(`/api/proxy${basePath}`);
  }
}
