import React from 'react';
import ContestCarousel from '../../components/Carousel/ContestCarousel';
import './LandingPage.css';
import LandingPage_LeftImage from '../../images/websiteImages/LandingPageImage.png';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const LandingPage = () => {

  const StyledLink = styled(Link)(({ theme }) => ({
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.common.white,
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark,
    },
  }));

  return (
    <div className='main_LandingPage'>
        <div className="main_rightContent">
          <div className="rightContent_carousel">
            <div className="rightContent_trendingContest_title">
              <div className='rightContent_trendingContest_title_trending'>Trending</div> Contests
            </div>
            <div className="rightContent_trendingContest">
              <ContestCarousel />
            </div>
          </div>
          <div className="rightContent_intro">
            Discover upcoming coding contests from leading platforms like <b>Codeforces, AtCoder, CodeChef, LeetCode, Gfg, Hackerearth and Topcoder</b> on Algo-Arena! 
            <br></br>
            Login now for a personalized contest schedule and an enhanced experience.
          </div>
          <div className="rightContent_button">
            {/* <Button variant="contained" color="warning">
              Get Started
            </Button> */}
            <StyledLink component={RouterLink} to="/login">
              Get Started
            </StyledLink>
          </div>
        </div>
        <div className="main_leftImage">
          <img src={LandingPage_LeftImage} alt='Left_side' style={{ width: '90%', objectFit: 'contain' }} />
        </div>
    </div>
  )
}

export default LandingPage;
