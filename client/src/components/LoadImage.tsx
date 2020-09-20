import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export async function LoadImg(url: string | undefined, key:string){
    return (
        <>
            <Img key={key} src={url} alt="" />
        </>
    )
}