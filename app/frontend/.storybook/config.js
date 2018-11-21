import { configure } from '@storybook/react'

function loadStories() {
  require('../stories/app.js')
  require('../stories/eth-address.js')
  require('../stories/check-button.js')
  require('../stories/file-input.js')
  require('../stories/file-row.js')
  require('../stories/edit-permissions.js')
  require('../stories/deleted-files-screen.js')
  require('../stories/label-screen.js')
}

configure(loadStories, module)
