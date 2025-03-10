import { Args, Query, Resolver } from '@nestjs/graphql';
import { SqsService } from './sqs.service';

@Resolver()
export class SqsTestResolver {
  constructor(private readonly sqsService: SqsService) {}

  @Query(() => String)
  async addToQueue(
    @Args('group', {
      defaultValue: 'general',
      description: 'The group to which the message belongs',
    })
    group: string,
    @Args('message', {
      description: 'The message to be sent to the queue',
    })
    message: string,
    @Args('jobType', {
      description: 'The type of job to be executed',
    })
    jobType: string,
  ): Promise<string> {
    await this.sqsService.send(
      {
        message,
      },
      jobType,
      group,
    );
    return `Sent to queue successfully!`;
  }
}
