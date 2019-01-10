import React from 'react'
import styled from 'styled-components'
import fontawesome from '@fortawesome/fontawesome'
// import solid from '@fortawesome/fontawesome-free-solid'
import * as solid from '@fortawesome/free-regular-svg-icons'
import * as regular from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import foldersSvg from '../images/folder.svg'

import * as fileDesc from './file-descriptions'

const FoldersIcon = styled.img.attrs({ src: foldersSvg })`
    width: 18px;
    vertical-align: middle;
    margin-left: -4px;
    margin-right: -2px;
`


export function downloadFile(file, filename) {
  const blob = new Blob([file], { type: "application/pdf" })

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob)
    return
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = data
  link.download = filename
  link.click()

  // For Firefox it is necessary to delay revoking the ObjectURL
  setTimeout(() => window.URL.revokeObjectURL(data), 100)
}

export function convertFileToArrayBuffer(file) {
  return new Promise((res) => {
    const reader = new FileReader()

    reader.onload = () => {
      res(reader.result)
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * @param {string} extension
 * @returns {string}
 */
export function getExtensionForFilename(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * @param {string} extension
 * @returns {string}
 */
export function getClassNameForFilename(filename) {
  const fileInfo = fileDesc.extensions[getExtensionForFilename(filename).toLowerCase()]

  return fileInfo
    ? fileInfo.className
    : fileDesc.classNames.file
}

export function getDescriptionForFilename(filename) {
  const fileInfo = fileDesc.extensions[getExtensionForFilename(filename).toLowerCase()]

  return fileInfo
    ? fileInfo.description
    : ''
}

export function getClassNameForFile(file) {
  return file.isFolder
    ? 'folder'
    : getClassNameForFilename(file.name)
}

export function getDescriptionForFile(file) {
  return file.isFolder
    ? 'Folder'
    : getDescriptionForFilename(file.name)
}

export function getIconForFile(file) {
  console.log('loading ', getClassNameForFile(file))
  return file.isFolder
    ? <FontAwesomeIcon style={{ height: '20px', marginLeft: '-2px', verticalAlign: 'middle', marginBottom: '3px' }} icon={regular.faFolder} />
    : <FontAwesomeIcon style={{ height: '17px' }} icon={regular[getClassNameForFile(file)]} />
}

export function loadFileIcons() {
  for (const icon of fileDesc.fontAwesomeIcons)
    fontawesome.library.add(solid[icon])
}

export function getFileName(file) {
  return file.id === 0
    ? 'Home'
    : file.name
}