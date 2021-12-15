import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Player, ControlBar, BigPlayButton } from 'video-react';
import "../../node_modules/video-react/dist/video-react.css";
import styled from 'styled-components';
import Button from '@mui/material/Button';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import InfoIcon from '@mui/icons-material/Info';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { blueGrey } from '@mui/material/colors';

const timeStamps = [
  {
    startTime: 5,
    endTime: 30,
    type: "phase",
    color: "primary",
    text: "Phase 1",
    description: "phase 1 description",
  },
  {
    startTime: 30,
    endTime: 42,
    type: "phase",
    color: "secondary",
    text: "Phase 2",
    description: "phase 2 description",
  },
  {
    startTime: 33,
    type: "event",
    color: "warning",
    text: "Event 1",
    description: "event 1 description",
  },
  {
    startTime: 36,
    type: "event",
    color: "warning",
    text: "Event 2",
    description: "event 2 description",
  },
  {
    startTime: 42,
    endTime: 50,
    type: "phase",
    color: "success",
    text: "Phase 3",
    description: "phase 3 description",
  },
  {
    startTime: 48,
    type: "event",
    color: "error",
    text: "Event 3",
    description: "event 3 description",
  },
];

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 800px;
  margin: 30px auto;
`;

const ProgressBar = styled.div`
  width: 800px;
  height: 30px;
  display: flex;
  background-color: ${blueGrey[100]};
  position: relative;
`;

const ItemContainer = styled.div`
  position: absolute;
  left: ${(props) => props.left}%;
  width: ${(props) => props.width}%;
  background-color: ${(props) => props.color};
  height: 30px;
  display: flex;
  z-index: ${(props) => props.isEvent ? 1000 : 0};
  cursor: pointer;
  transition: all .2s;

  :hover {
    transform: scale(1.05);
    z-index: 100;
  }
`;

const PhaseButtonsContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  width: 800px;
`;

const EventContainer = styled.div`
  display: flex;
  align-items: center;
`;

const EventDescriptionContainer = styled.div`
  width: 650px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EventTextContainer = styled.div`
  font-family: Roboto;
`;

const ButtonContainer = styled.div`
  width: 120px;
  margin: 10px;
`;

const Main = () => {
  const theme = useTheme();

  const playerRef = useRef();
  const [videoDuration, setVideoDuration] = useState();

  const setNewVideoDuration = useCallback((state) => {
    setVideoDuration(state.duration);
  });

  useEffect(() => {
    playerRef.current.subscribeToStateChange(setNewVideoDuration);
  }, [playerRef.current]);

  const getPhaseWidthPercentage = useCallback((phaseStartTime, phaseEndTime) => {
    return ((phaseEndTime - phaseStartTime) / videoDuration) * 100;
  });

  const getPhaseStartPercentage = useCallback((phaseStartTime) => {
    return (phaseStartTime / videoDuration) * 100;
  });

  const getPhaseName = useCallback((eventStartTime) => {
    const phase = timeStamps.find((item) => item.type === "phase" && item.startTime <= eventStartTime && item.endTime > eventStartTime);
    return phase.text;
  });

  const getTimelineValues = useCallback((timeStampsArray) => {
    const timelineValues = timeStampsArray.map((item) => {
      return {
        width:
          item.type === "phase"
            ? getPhaseWidthPercentage(item.startTime, item.endTime)
            : 1,
        left: getPhaseStartPercentage(item.startTime),
        color: theme.palette[item.color][500],
        startTime: item.startTime,
        isEvent: item.type === "event",
      };
    });
    return timelineValues;
  });

  const timeJump = useCallback((time) => {
    playerRef.current.seek(time);
  });

  return (
    <MainContainer>
      <Player
        ref={(p) => (playerRef.current = p)}
        playsInline
        fluid={false}
        width={800}
        height={500}
      >
        <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"></source>
        <BigPlayButton position="center" />
        <ControlBar disableCompletely={false} />
      </Player>
      {videoDuration ? (
        <ProgressBar>
          {getTimelineValues(timeStamps).map((item) => (
            <ItemContainer
              color={item.color}
              width={item.width}
              left={item.left}
              onClick={() => timeJump(item.startTime)}
              isEvent={item.isEvent}
            />
          ))}
        </ProgressBar>
      ) : (
        <Skeleton width={800} />
      )}

      <PhaseButtonsContainer>
        {timeStamps.map((item) => {
          if (item.type === "phase") {
            return (
              <ButtonContainer>
                <Button
                  variant="contained"
                  color={item.color}
                  onClick={() => timeJump(item.startTime)}
                  endIcon={<SkipNextIcon />}
                >
                  {item.text}
                </Button>
              </ButtonContainer>
            );
          }
        })}
      </PhaseButtonsContainer>

      <EventsContainer>
        {timeStamps.map((item) => {
          if (item.type === "event") {
            return (
              <EventContainer>
                <ButtonContainer>
                  <Button
                    variant="contained"
                    color={item.color}
                    onClick={() => timeJump(item.startTime)}
                    endIcon={<SkipNextIcon />}
                  >
                    {item.text}
                  </Button>
                </ButtonContainer>
                <EventDescriptionContainer>
                  <EventTextContainer>
                    {`${getPhaseName(item.startTime)} - ${item.description}`}
                  </EventTextContainer>
                </EventDescriptionContainer>
                <InfoIcon color="info" />
              </EventContainer>
            );
          }
        })}
      </EventsContainer>
    </MainContainer>
  );
};

export default Main;