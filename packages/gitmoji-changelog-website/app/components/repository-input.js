import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class RepositoryInputComponent extends Component {
  @tracked repositoryUrl
  @tracked changelog = ''
  @tracked loading = false

  @action
  onSubmit(e) {
    e.preventDefault()
    this.loading = true
    fetch(`http://localhost:9999/?repository=${this.repositoryUrl}`)
      .then(res => res.text())
      .then(changelog => {
        const formattedChangelog = changelog
          .split('\n')
          .slice(1)
          .join('\n')
        this.changelog = formattedChangelog
        this.loading = false
      })
      .catch((err) => {
        console.error(err)
      })
  }

  @action
  updateRepositoryUrl(e) {
    this.repositoryUrl = e.target.value
  }
}
