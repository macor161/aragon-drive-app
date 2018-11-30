import { observable, observe, action } from 'mobx'


export class LabelStore {
    @observable availableLabels = []

    @observable selectedLabel = null

    isLabelSelected = label => this.selectedLabel && this.selectedLabel.id === label.id

    @action selectLabel(label) {
      if (this.selectedLabel && this.selectedLabel.id === label.id)
        this.selectedLabel = null
      else
        this.selectedLabel = label
    }

    @action async createLabel(name, color) {
      await this._datastore.createLabel(name, color)
    }

    @action deleteLabel(labelId) {
      this._datastore.deleteLabel(labelId)
    }

    @action assignLabel(fileId, labelId) {
      this._datastore.assignLabel(fileId, labelId)
    }

    @action unassignLabel(fileId, labelId) {
      this._datastore.unassignLabel(fileId, labelId)
    }

    _datastore

    _mainStore

    constructor(datastore, mainStore) {
      this._datastore = datastore
      this._mainStore = mainStore

      this.initialize()
    }

    async initialize() {
      return new Promise(async (res) => {
        (await this._datastore.events()).subscribe(async (event) => {
          switch (event.event) {
            case 'LabelChange':
              await this._refreshAvailableLabels()
              // If selected label is no more in the label list, unselect it
              if (this.selectedLabel && !this.availableLabels.some(label => label.id === this.selectedLabel.id))
                this.selectedLabel = null
              break
          }
        });

        this._refreshAvailableLabels()
        res()
      })
    }

    async _refreshAvailableLabels() {
      this.availableLabels = await this._datastore.getLabels()
    }
}
