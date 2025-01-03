import axios from "axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./ContestCarousel.css";
import CircularProgress from "@mui/material/CircularProgress";
import AtcoderLogo from "../../images/codingWebsiteLogos/Atcoder.png";
import CodechefLogo from "../../images/codingWebsiteLogos/Codechef.png";
import CodeforcesLogo from "../../images/codingWebsiteLogos/Codeforces.png";
import GeeksForGeeksLogo from "../../images/codingWebsiteLogos/GeeksForGeeks.png";
import HackerearthLogo from "../../images/codingWebsiteLogos/Hackerearth.png";
import LeetcodeLogo from "../../images/codingWebsiteLogos/Leetcode.png";
import TopcoderLogo from "../../images/codingWebsiteLogos/Topcoder.png";

const ContestCarousel = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpcomingContests = async () => {
    try {
      console.log("Fetching upcoming contests...");
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/getUpcomingContestsData"
      );
      setUpcomingContests(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error in fetching upcoming contests from Backend: ", error);
    }
  };

  useEffect(() => {
    fetchUpcomingContests();
  }, []);

  const capitalizeWords = (str) => {
    return str.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase());
  };

  const items = upcomingContests.slice(0, 5).map((contest) => {
    return (
      <div className="carousel_contest">
        {contest.contestPlatform === "Atcoder" ? (
          <img
            src={AtcoderLogo}
            alt="Atcoder"
            height="80"
            style={{ marginBottom: 10 }}
          />
        ) : contest.contestPlatform === "Codechef" ? (
          <img
            src={CodechefLogo}
            alt="Codechef"
            height="80"
            style={{ marginBottom: 10 }}
          />
        ) : contest.contestPlatform === "Codeforces" ? (
          <img
            src={CodeforcesLogo}
            alt="Codeforces"
            height="80"
            style={{ marginBottom: 10 }}
          />
        ) : contest.contestPlatform === "Gfg" ? (
          <img
            src={GeeksForGeeksLogo}
            alt="Gfg"
            height="80"
            style={{ marginBottom: 10 }}
          />
        ) : contest.contestPlatform === "Hackerearth" ? (
          <img
            src={HackerearthLogo}
            alt="Hackerearth"
            height="80"
            style={{ marginBottom: 10 }}
          />
        ) : contest.contestPlatform === "Leetcode" ? (
          <img
            src={LeetcodeLogo}
            alt="Leetcode"
            height="80"
            style={{ marginBottom: 10 }}
          />
        ) : (
          <img
            src={TopcoderLogo}
            alt="Topcoder"
            height="80"
            style={{ marginBottom: 10 }}
          />
        )}

        {contest.contestPlatform === "Atcoder" ? (
          <div className="carousel_contestPlatform" style={{ color: "gray" }}>
            {contest.contestPlatform}
          </div>
        ) : contest.contestPlatform === "Codechef" ? (
          <div className="carousel_contestPlatform" style={{ color: "orange" }}>
            {contest.contestPlatform}
          </div>
        ) : contest.contestPlatform === "Codeforces" ? (
          <div className="carousel_contestPlatform" style={{ color: "red" }}>
            {contest.contestPlatform}
          </div>
        ) : contest.contestPlatform === "Gfg" ? (
          <div className="carousel_contestPlatform" style={{ color: "green" }}>
            {contest.contestPlatform}
          </div>
        ) : contest.contestPlatform === "Hackerearth" ? (
          <div className="carousel_contestPlatform" style={{ color: "green" }}>
            {contest.contestPlatform}
          </div>
        ) : contest.contestPlatform === "Leetcode" ? (
          <div className="carousel_contestPlatform" style={{ color: "gold" }}>
            {contest.contestPlatform}
          </div>
        ) : (
          <div className="carousel_contestPlatform" style={{ color: "blue" }}>
            {contest.contestPlatform}
          </div>
        )}

        <div className="carousel_contestName">
          {contest.contestName.length > 20
            ? `${capitalizeWords(contest.contestName.substring(0, 20))} ...`
            : capitalizeWords(contest.contestName)}
        </div>

        <div className="carousel_contestDateTime">
          <div className="carousel_contestDate">{contest.contestStartDate}</div>
          <div className="carousel_contestTime">{contest.contestStartTime}</div>
        </div>
      </div>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 3,
    },
    1024: {
      items: 4,
    },
  };

  return (
    <div className="main">
      {loading ? (
        <CircularProgress />
      ) : (
        <AliceCarousel
          mouseTracking
          animationDuration={1500}
          disableDotsControls
          disableButtonsControls={false}
          responsive={responsive}
          items={items}
          autoHeight={true}
        />
      )}
    </div>
  );
};

export default ContestCarousel;
