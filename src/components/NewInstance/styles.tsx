import styled, { css } from 'styled-components'

export const InstanceContainer = styled.div`
  display: flex;
  gap: 80px;
  margin-bottom: 24px;
`

export const Button = styled.button<{
  width?: number
  height?: number
  radius?: number
  svgSize?: number
}>`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ width, height, radius, svgSize }) => css`
    min-width: ${width ? `${width}px` : `70px`};
    min-height: ${height ? `${height}px` : `70px`};
    max-width: ${width ? `${width}px` : `70px`};
    max-height: ${height ? `${height}px` : `70px`};
    border-radius: ${radius ? `${radius}px` : `10px`};

    svg {
      width: ${svgSize ? `${svgSize}px` : `32px`};
      height: ${svgSize ? `${svgSize}px` : `32px`};

      path {
        fill: #fff;
      }
    }
  `}

  background: none;
  cursor: pointer;
  border: 1px solid #ffffff;

  &:disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  }
`

export const ImageSelected = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  object-fit: cover;
  object-position: center;
`

