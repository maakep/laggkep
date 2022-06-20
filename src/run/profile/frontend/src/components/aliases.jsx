import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Scroller, SquareGraphBlock, Title, SmallBlock } from '../lib/blocks';

export function Alias({ aliasData, id }) {
  const [aliases, setAliases] = useState(aliasData);

  async function deleteAlias(alias) {
    fetch('/api/deleteAlias', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        alias: alias,
      }),
    }).then((x) => {
      if (x.status != '200') {
        setAliases([...aliases, alias]);
      }
    });

    setAliases(aliases.filter((x) => x != alias));
  }

  return (
    <SquareGraphBlock>
      <Title>Aliases</Title>
      <Scroller>
        {aliases?.map((x) => {
          return (
            <SmallBlock>
              <AliasRow>
                <div>{x}</div>
                <Delete onClick={() => deleteAlias(x)}>&#10006;</Delete>
              </AliasRow>
            </SmallBlock>
          );
        })}
      </Scroller>
    </SquareGraphBlock>
  );
}

const AliasRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Delete = styled.div`
  cursor: pointer;
  padding: 0 8px;

  &:hover {
    color: red;
  }
`;
