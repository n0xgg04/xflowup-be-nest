import { Injectable } from '@nestjs/common';

@Injectable()
export default class GithubService {
  async getRepositories(username: string): Promise<any> {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`,
    );
    const repositories = await response.json();
    return repositories.map((repository: any) => ({
      id: repository.id,
      name: repository.name,
      url: repository.html_url,
    }));
  }
}
