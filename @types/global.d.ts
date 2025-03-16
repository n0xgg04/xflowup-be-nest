declare global {
  type User = {
    id: number;
    email: string;
    name: string;
    profile_pic_url: string;
    current_plan: string;
    created_at: string;
    updated_at: string;
  };

  export interface SQSMessage {
    QueueUrl: string;
    MessageBody: string;
    MessageGroupId?: string;
    MessageDeduplicationId?: string;
    DelaySeconds?: number;
  }

  export interface Job {
    DataType: string;
    value: string;
  }
  export interface MessageAttributes {
    job: Job;
  }

  export interface MessageBody {
    messageId: string;
    message: any;
    date: string;
    MessageAttributes: MessageAttributes;
  }

  type GithubUserProfile = {
    emails: {
      value: string;
    }[];
    displayName: string;
    username: string;
    photos: {
      value: string;
    }[];
  };

  type User = {
    id: number;
    email: string;
    name: string;
    profile_pic_url: string;
    current_plan: string;
  };
}

export {};
