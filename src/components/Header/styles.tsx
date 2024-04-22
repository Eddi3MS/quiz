import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const MainHeader = styled.header`
  width: 100%;
  height: 80px;
  padding: 0 75px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid #48485e;
`

export const Anchor = styled(Link)`
  font-size: 16px;
  color: #fff;
  text-decoration: none;
  margin-left: 32px;

  &:hover {
    text-decoration: underline;
  }
`

