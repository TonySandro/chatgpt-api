import { ChatJob } from "../models/chat-job";

export interface IChatProcessor {
  process(job: ChatJob): Promise<void>;
}
