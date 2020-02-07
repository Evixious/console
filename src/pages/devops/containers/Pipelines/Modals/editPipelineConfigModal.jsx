/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Modal } from 'components/Base'
import { get, set } from 'lodash'

import FormSetting from 'components/Forms/CICDs/AdvanceSettings'

const ENABLE_PARAMS = [
  'discarder',
  'timer_trigger',
  'remote_trigger',
  'regex_filter',
  'multibranch_job_trigger',
]

@observer
export default class EditPipelineConfig extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    branches: PropTypes.array,
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      formTemplate: {},
    }
  }

  static defaultProps = {
    branches: [],
    visible: false,
    onOk() {},
    onCancel() {},
  }

  componentWillReceiveProps(nextProps) {
    const { formTemplate } = nextProps
    if (nextProps.visible) {
      this.setEnableFlag(formTemplate)
      set(formTemplate, 'project_id', this.props.project_id)
    }
  }

  setEnableFlag = formTemplate => {
    const { pipeline, multi_branch_pipeline } = formTemplate || {}
    const scmData = pipeline || multi_branch_pipeline
    if (!scmData) return
    ENABLE_PARAMS.forEach(param => {
      const hasData =
        scmData[param] ||
        get(scmData, `svn_source.${param}`) ||
        get(scmData, `git_source.${param}`) ||
        get(scmData, `github_source.${param}`) ||
        get(scmData, `bitbucket_server_source.${param}`) ||
        get(scmData, 'multibranch_job_trigger')
      if (scmData[param] || hasData) {
        formTemplate[`enable_${param}`] = true
      }
    })
    this.setState({
      formTemplate,
    })
  }

  handleOk = () => {
    const form = this.formRef && this.formRef.current

    form &&
      form.validate(() => {
        this.props.onOk(this.formRef.current._formData)
      })
  }

  render() {
    const { visible, onCancel } = this.props

    return (
      <Modal
        width={1162}
        onCancel={onCancel}
        onOk={this.handleOk}
        visible={visible}
        closable={false}
        title={t('Edit Pipeline')}
      >
        <FormSetting
          type="edit"
          formRef={this.formRef}
          formTemplate={this.state.formTemplate}
        />
      </Modal>
    )
  }
}
