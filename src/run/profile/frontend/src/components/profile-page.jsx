import * as React from "react";
import styled from "styled-components";
import { Block, Row } from "../lib/blocks";
import { Doughnut, Line } from "react-chartjs-2";
import { colors, hoverColors } from "../lib/colors";
import "chart.js/auto";
import { Chart } from "chart.js";

Chart.defaults.color = "#ffffff";
Chart.defaults.font.weight = "bold";

/**
 *

  game: "dota 2"
  gameId: 10
  id: "10-1-4"
  matchId: "6236053057"
  timestamp: "2022-03-29T21:35:48.537Z"
  username: "130467432513929216"
  win: false
  _game: "Dota 2"

 * 
 */

export function ProfilePage({ data }) {
  let wins = 0;
  let losses = 0;

  let games = {};
  const gamesOverTime = {};
  const mmrOverTime = {};

  data = data.reverse();
  let mmr = 1337;

  data.forEach((x, i) => {
    wins += Number(x.win);
    losses += Number(!x.win);

    const date = new Date(x.timestamp);
    const dateYMD = `${date.getUTCFullYear()}-${(
      "0" +
      (date.getUTCMonth() + 1)
    ).slice(-2)}-${("0" + (date.getUTCDay() + 1)).slice(-2)}`;

    const dateYMDT = `${dateYMD}-${("0" + date.getUTCHours()).slice(-2)}-${(
      "0" + date.getUTCMinutes()
    ).slice(-2)}`;

    if (gamesOverTime[dateYMD] == undefined) {
      gamesOverTime[dateYMD] = 0;
    }
    gamesOverTime[dateYMD] += 1;

    mmr += x.win ? 25 : -25;
    mmrOverTime[dateYMDT] = mmr;

    if (games[x.game]) {
      games[x.game].num += 1;
    } else {
      games[x.game] = { num: 1, percent: 0 };
    }
  });

  const winrate = wins / (wins + losses);

  return (
    <Body>
      <Header>
        <HeaderItem>
          LAGGAN, {location.href.split("/").pop().toLocaleUpperCase()} ({mmr})
        </HeaderItem>
      </Header>
      <Row>
        <SquareGraphBlock>
          <Title>Overall winrate ({winrate.toFixed(3) * 100}%)</Title>
          <div>
            <Doughnut
              options={getOptions()}
              data={getData(["win", "loss"], [wins, losses])}
            />
          </div>
        </SquareGraphBlock>
        <SquareGraphBlock>
          <Title>Game distribution</Title>
          <div>
            <Doughnut
              options={getOptions()}
              data={getData(
                Object.keys(games),
                Object.values(games).map((x) => x.num)
              )}
            />
          </div>
        </SquareGraphBlock>
      </Row>
      <Row>
        <RectGraphBlock>
          <Title>Games over time</Title>
          <Line
            options={getOptions()}
            data={{
              ...getData(
                Object.keys(gamesOverTime),
                Object.values(gamesOverTime),
                "PLAYED GAMES"
              ),
            }}
          />
        </RectGraphBlock>
      </Row>
      <Row>
        <RectGraphBlock>
          <Title>Games over time</Title>
          <Line
            options={getOptions()}
            data={{
              ...getData(
                Object.keys(mmrOverTime),
                Object.values(mmrOverTime),
                "LAGGAN MMR"
              ),
            }}
          />
        </RectGraphBlock>
      </Row>
    </Body>
  );
}

function getData(labels, data, label = "") {
  return {
    labels: labels,
    maintainAspectRatio: false,
    responsive: false,
    datasets: [
      {
        label: label,
        data: data,
        backgroundColor: colors,
        hoverBackgroundColor: hoverColors,
        borderColor: "#ffffff",
      },
    ],
  };
}

function getOptions() {
  return {
    legend: {
      display: false,
      position: "right",
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };
}

const Body = styled.div``;

const headerHeight = 70;
const Header = styled.div`
  width: 100%;
  height: ${headerHeight}px;
  background: #292e34;
  display: flex;
  justify-content: space-between;
`;
const HeaderItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const SquareGraphBlock = styled(Block)`
  width: 300px;
  height: 300px;
  margin: 16px;
  position: relative;
`;

const RectGraphBlock = styled(Block)`
  width: 900px;
  height: 460px;
  margin: 16px;
  position: relative;
`;

const Title = styled.span`
  position: absolute;
  font-size: 24px;
  top: -14px;
  font-weight: bold;
`;
