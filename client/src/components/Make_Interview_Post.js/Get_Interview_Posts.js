import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Pagination from '@material-ui/lab/Pagination';
import theme from "./theme";
import { ThemeProvider } from '@material-ui/core/styles';
import Hiring from '../../images/Interview-posts/hiring.png'
import Hired from '../../images/Interview-posts/hired.png'
import Meeting from '../../images/Interview-posts/assess.jpg'
import Speech from '../../images/Interview-posts/interview.jpg'
import './Get_Interview_Posts.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import moment from "moment"; 
import Loading from '../Loading';
import {Link} from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#fff"
  },
  hero: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80')`,
    height: "500px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: "4rem",
    [theme.breakpoints.down("sm")]: {
      height: 300,
      fontSize: "3em"
    }
  },
  blogsContainer: {
    paddingTop: theme.spacing(3)
  },
  blogTitle: {
    fontWeight: 800,
    paddingBottom: theme.spacing(3)
  },
  card: {
    maxWidth: "100%",
  },
  media: {
    height: 240
  },
  cardActions: {
    display: "flex",
    margin: "0 10px",
    justifyContent: "space-between"
  },
  author: {
    display: "flex"
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center"
  }
}));

  var settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
function Get_Interview_Posts() {

    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchPosts = async() =>{
        setLoading(true);
        axios
        .get("/user/get-all-users-posts")
        .then((res) => {
            console.log(res.data)
            setPosts(res.data);
            setLoading(false);
        })
        .catch((err) => {
            if (!localStorage.getItem("firstlogin")){
            } 
            else alert("couldn't fetch please reload");
        });
    }
    useEffect(()=>{
        console.log("Hey")
        fetchPosts();
    },[])
  return (
    <ThemeProvider theme = {theme}> 
    <div className="Get_Interview_Posts">
    <> 

    
    <Carousel autoPlay={true} infiniteLoop={true} emulateTouch={true}	>
        <div>
            <img className = "home__image" src={Hiring} alt=""/>       
        </div>
        <div>
            <img className = "home__image" src={Meeting} alt=""/>
        </div>
        <div>
            <img className = "home__image" src={Speech} alt=""/>        
        </div>
    </Carousel>
    
    
    </>
      
        <Container maxWidth="lg" className={classes.blogsContainer}>
        <Typography variant="h4" className={classes.blogTitle}>
            Job Posts
        </Typography>
        <Grid container spacing={5}>
           
            {loading && (
                <Loading />
            )}
            {
                loading === false && posts?.map(post => {

                  let substring = post.job_description.substring(0,80) + "...";
                  return(          
                      <Grid item xs={12} sm={6} md={4} >
                      <Link to={`/posts/open-job-post-page/${post._id}`}> 
                      <Card className={classes.card}>
                          <CardActionArea>
                          <CardMedia
                              className={classes.media}
                              image={post.post_picture}
                              title="Contemplative Reptile"
                          />
                          <CardContent>
                              <Typography gutterBottom variant="h5" component="h2">
                                  {post.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" component="p">
                                  {substring}
                              </Typography>
                          </CardContent>
                          </CardActionArea>
                          <CardActions className={classes.cardActions}>
                          <Box className={classes.author}>
                              <Avatar src={post.postedBy_avatar} />
                              <Box ml={2}>
                              <Typography variant="subtitle2" component="p">
                                  {post.postedBy_name}
                              </Typography>
                              <Typography variant="subtitle2" color="textSecondary" component="p">
                                  {moment(post?.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM-DD-YYYY')}
                              </Typography>
                              </Box>
                          </Box>
                          <Box>
                              <BookmarkBorderIcon />
                          </Box>
                          </CardActions>
                      </Card>
                    </Link>
                   </Grid>
                    
            )})
          }  
        </Grid>
        <Box my={4} className={classes.paginationContainer}>
            <Pagination count={10} />
        </Box>
        </Container>
    </div>
    </ThemeProvider>
    
  );
}

export default Get_Interview_Posts;
