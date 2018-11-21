import React from "react"
import { BigNumber } from 'bignumber.js'
import { Provider } from 'mobx-react'
import { aragonStoriesOf } from '../src/utils/aragon-stories-of'
import { LabelScreen } from '../src/components/label-screen/label-screen'
import { Datastore as MockedDatastore } from '../src/__mocks__/datastore'
import { MainStore } from '../src/stores/main-store'


const labels = []


aragonStoriesOf("LabelScreen", module).add("Basic", () => {
  const datastore = new MockedDatastore({})
  const mainStore = new MainStore(datastore)

  return (
    <Provider datastore={datastore} mainStore={mainStore}>
      <LabelScreen isVisible mainStore={mainStore} />
    </Provider>
  )
})