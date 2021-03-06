import React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'

import { Field, TextInput, DropDown, Text } from '@aragon/ui'
import { ConfigurationRadioGrp } from '../configuration-radio-grp'
import { SaveButton, LargeTextInput } from '../large-inputs'

export const ConfigurationScreen = inject("configStore")(observer(({ configStore }) =>
  <Main>
    <Title>Storage</Title>

    <ConfigurationRadioGrp
      style={{ marginTop: '20px' }}
      options={configStore.configSelected ? [configStore.radioGrpSelectedValue] : ["ipfs", "swarm", "filecoin"]}
      store={configStore}
    />

    <ConfigurationSectionAdvancedBtn href="#" onClick={(e) => { configStore.isAdvancedConfigOpen = !configStore.isAdvancedConfigOpen; e.nativeEvent.stopImmediatePropagation(); }}>
      {configStore.isAdvancedConfigOpen ? '-' : '+'}Advanced options
    </ConfigurationSectionAdvancedBtn>

    <form onSubmit={event => event.preventDefault()}>
      <AdvancedOptionsContainer open={configStore.isAdvancedConfigOpen}>
        <IpfsAdvancedOptions storage={configStore.radioGrpSelectedValue}>
          <Field label="IPFS host:">
            <LargeTextInput value={configStore.host} onChange={e => configStore.host = e.target.value} required />
          </Field>
          <Field label="IPFS port:">
            <LargeTextInput value={configStore.port} onChange={e => configStore.port = e.target.value} required type="number" />
          </Field>
          <Field label="Protocol">
            <DropDown items={['HTTP', 'HTTPS']} active={configStore.protocolIndex} onChange={e => configStore.protocolIndex = e} />
          </Field>
        </IpfsAdvancedOptions>
        <div className="filecoinAdvancedOptions" style={{ display: configStore.radioGrpSelectedValue === "filecoin" ? 'block' : 'none' }}>Coming soon</div>
        <div className="swarmAdvancedOptions" style={{ display: configStore.radioGrpSelectedValue === "swarm" ? 'block' : 'none' }}>This uses the Swarm public gateway. Beware that any data that is uploaded could be lost.</div>
      </AdvancedOptionsContainer>

      <ButtonContainer>
        <SaveButton
          disabled={configStore.radioGrpSelectedValue === "filecoin"}
          onClick={() => configStore.setSettings(configStore.radioGrpSelectedIndex + 1, configStore.host, configStore.port, configStore.protocolArray[configStore.protocolIndex])}
          type="submit"
        >Save
        </SaveButton>
      </ButtonContainer>
    </form>
  </Main>))

const Main = styled.div`
  padding-top: 30px;
  padding-left: 64px;
`
const ButtonContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 0px;
  width: 130px;
`
const IpfsAdvancedOptions = styled.div`
  max-width: 194px;
  display: ${({ storage }) => storage === 'ipfs' ? 'block' : 'none'};
`

const Title = styled(Text).attrs({ size: 'xlarge' })`
  display: block;
`
const AdvancedOptionsContainer = styled.div`
  display: ${({ open }) => open ? 'block' : 'none'};
  margin-left: 0px;
`
const ConfigurationSectionAdvancedBtn = styled.a`
    font-size: small;
    &:hover ${ConfigurationSectionAdvancedBtn} {
        color: #50B6E1;
    }
    margin-left: 2px;
`