/**
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Custom Toolbar Components.
 * @author mbordihn@google.com (Markus Bordihn)
 */

import React from 'react';

import styled from 'styled-components';
import Box from '@mui/material/Box';
import { Button, IconButton } from '@mui/material';

const StyledToolbar = styled(Box)`
  align-items: center;
  background: #f2f2f2;
  color: #333;
  display: flex;
  font-size: 16px;
  height: 37px;
  justify-content: space-between;
  line-height: 16px;
  padding: 2px 4px;
`;

const StyledIconButton = styled(IconButton)`
  padding: 5px 10px;
`;

const StyledButton = styled(Button)`
  padding: 5px 10px;
`;

/**
 * @param {Object} props
 * @return {any}
 */
export function Toolbar(props) {
  return <StyledToolbar {...props} />;
}

/**
 * @param {Object} props
 * @return {any}
 */
export function ToolbarIconButton(props) {
  return <StyledIconButton color="primary" {...props} />;
}

/**
 * @param {Object} props
 * @return {any}
 */
export function ToolbarButton(props) {
  return <StyledButton color="primary" {...props} />;
}
