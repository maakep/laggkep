import * as React from 'react';
import styled from 'styled-components';

export function SearchPage({ setData }) {
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onChange = (e) => {
    const text = e.currentTarget.value;
    setInput(text);
  };

  const submitOnEnter = (e) => {
    if (e.key == 'Enter') {
      fetchData();
    }
  };

  async function fetchData() {
    setLoading(true);
    const result = await (await fetch(`/api/profile/${input}`)).json();
    if (result?.data) {
      setData(result.data);
      history.pushState({}, '', `/id/${input}`);
    } else {
      setLoading(false);
    }
  }

  return (
    <Body>
      {loading ? (
        <div>Loading... Crunching the latest numbers, just for you.</div>
      ) : (
        <Search
          placeholder={'Any registered nickname'}
          autoFocus={true}
          value={input}
          onChange={onChange}
          onKeyDown={submitOnEnter}
        />
      )}
    </Body>
  );
}

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background: url('https://laggan.online/lagganwolf_lone.png');
  background-size: cover;
`;
const Search = styled.input`
  padding: 16px;
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
`;
