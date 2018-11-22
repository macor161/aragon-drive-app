import React, { Component } from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { Field } from '@aragon/ui'
import { SaveButton, LargeTextInput } from './large-inputs'

@inject("mainStore")
@observer
export class EditGroupMember extends Component {
  state = { newMember: '' }

  get mainStore() { return this.props.mainStore }

  render() {
    return (
      <Main>
        <form onSubmit={event => event.preventDefault()}>
          <Field label="Member address:">
            <LargeTextInput value={this.state.newMember} onChange={e => this.setState({ newMember: e.target.value })} required pattern="0[xX][0-9a-fA-F]+" title="Use a valid Ethereum address." />
          </Field>
          <Actions>
            <SaveButton onClick={() => this.mainStore.addEntityToGroup(this.props.group.id, this.state.newMember)} type="submit">Add Member</SaveButton>
          </Actions>
        </form>
      </Main>
    )
  }
}

const Main = styled.div`  
`
const Actions = styled.div`
  margin-top: 40px;
  margin-bottom: 20px;
`