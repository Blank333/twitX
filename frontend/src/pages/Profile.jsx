import { Button, Col, Container, Image, Placeholder, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./Profile.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { faLocation } from "@fortawesome/free-solid-svg-icons";
import Tweets from "../components/Tweets";
import noTweets from "../assets/noTweets.png";
import { updateFollowing } from "../redux/slices/userSlice";
import EditProfileModal from "../components/EditProfileModal";
import UploadPicModal from "../components/UploadPicModal";
import FollowsModal from "../components/FollowsModal";
import defaultProfile from "../assets/defaultProfile.jpg";

function Profile() {
  const userInfo = useSelector((state) => state.user);
  const { username } = useParams();
  const [profileInfo, setProfileInfo] = useState({});
  const [tweets, setTweets] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showFollows, setShowFollows] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    // Fetch user profile
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/${username}`, { headers: { Authorization: token } })
      .then((res) => {
        setProfileInfo(res.data.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      });

    // Fetch user tweets
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/${username}/tweets`, { headers: { Authorization: token } })
      .then((res) => {
        setTweets(res.data.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  const handleFollow = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/user/${profileInfo._id}/follow`, {}, { headers: { Authorization: token } })
      .then((res) => {
        toast.success(res.data.message);
        // Update following and followers in the state variables
        dispatch(updateFollowing({ following: [...userInfo.following, profileInfo._id] }));
        setProfileInfo({ ...profileInfo, followers: [...profileInfo.followers, { _id: userInfo._id }] });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };

  const handleUnfollow = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/user/${profileInfo._id}/unfollow`,
        {},
        { headers: { Authorization: token } }
      )
      .then((res) => {
        toast.success(res.data.message);
        // Update following and followers in the state variables
        dispatch(updateFollowing({ following: userInfo.following.filter((user) => user !== profileInfo._id) }));
        setProfileInfo({
          ...profileInfo,
          followers: profileInfo.followers.filter((user) => user._id !== userInfo._id),
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };
  return (
    <Container className='border-start border-end h-100'>
      <Row className='border-bottom py-2 position-sticky start-0 top-0 bg-white d-flex align-items-center'>
        <Col>
          <h5>Profile</h5>
        </Col>
      </Row>
      {/* User image */}
      <Row className='bg-main profile-header position-relative'>
        {!profileInfo.profilePicURL ? (
          <Placeholder as='image' animation='glow'>
            <Placeholder xs={12} className='user-profile-picture' />
          </Placeholder>
        ) : (
          <Image
            src={profileInfo.profilePicURL || defaultProfile}
            alt='profile picture'
            className='user-profile-picture  '
          />
        )}
      </Row>

      {/* Actions */}
      <div className='d-flex justify-content-end align-items-end py-3 profile-info'>
        {!loading ? (
          // When visint other profiles
          userInfo._id !== profileInfo._id ? (
            userInfo.following.find((userId) => userId === profileInfo._id) ? (
              <Button className='bg-main bg-hover border-0' onClick={handleUnfollow}>
                Unfollow
              </Button>
            ) : (
              <Button className='bg-main bg-hover border-0' onClick={handleFollow}>
                Follow
              </Button>
            )
          ) : (
            // When on own profile
            <div className='d-flex flex-column flex-md-row gap-3'>
              {/* Upload Profile Picture */}
              <Button className='bg-clear bg-hover' onClick={() => setShowUpload(true)}>
                Upload Profile Photo
              </Button>
              <UploadPicModal
                show={showUpload}
                onHide={() => setShowUpload(false)}
                userInfo={profileInfo}
                setUserInfo={setProfileInfo}
              />

              {/* Edit Profile Information */}
              <Button className='bg-clear bg-hover' onClick={() => setShowEdit(true)}>
                Edit Profile
              </Button>
              <EditProfileModal
                show={showEdit}
                onHide={() => setShowEdit(false)}
                userInfo={profileInfo}
                setUserInfo={setProfileInfo}
              />
            </div>
          )
        ) : (
          <Placeholder as='button' animation='glow' className='bg-main bg-hover border-0 rounded p-1 text-white'>
            ...
          </Placeholder>
        )}
      </div>

      {/* User name */}
      <Row>
        {!profileInfo.profilePicURL ? (
          <Placeholder as='div' animation='glow' className='d-flex flex-column gap-3' />
        ) : (
          <Col>
            <h3>{profileInfo.name}</h3>
            <p className='text-secondary'>@{profileInfo.username}</p>
          </Col>
        )}
      </Row>

      {/* User Information */}
      {profileInfo.username && (
        <>
          <Row className='my-3'>
            <Col md={5} className='d-flex flex-column gap-2'>
              <p className='text-secondary'>
                <FontAwesomeIcon icon={faCalendarAlt} /> DOB{" "}
                {profileInfo.dateOfBirth
                  ? new Date(profileInfo.dateOfBirth).toUTCString().split(" ").slice(0, 4).join(" ")
                  : ""}
              </p>
              <p className='text-secondary'>
                <FontAwesomeIcon icon={faCalendar} /> Joined{" "}
                {new Date(profileInfo.createdAt).toUTCString().split(" ").slice(0, 4).join(" ")}
              </p>
            </Col>
            <Col md={5}>
              <p className='text-secondary'>
                <FontAwesomeIcon icon={faLocation} /> Location {profileInfo.location}
              </p>
            </Col>
          </Row>

          {/* Followers/Following */}
          <Row>
            <Col className='d-flex gap-3 align-items-center'>
              <Button variant='clear' onClick={() => setShowFollows("Following")}>
                <h6>{profileInfo.following.length} Following</h6>
              </Button>
              <Button variant='clear' onClick={() => setShowFollows("Followers")}>
                <h6>{profileInfo.followers.length} Followers</h6>
              </Button>
              <FollowsModal
                show={showFollows}
                followers={profileInfo.followers}
                following={profileInfo.following}
                onHide={() => setShowFollows(false)}
              />
            </Col>
          </Row>
        </>
      )}

      {/* User Tweets */}
      {!loading && tweets.length ? (
        <Row>
          <h4 className='text-center'>Tweets and replies</h4>

          <Tweets tweets={tweets} setTweets={setTweets} />
        </Row>
      ) : loading ? (
        <div className='border p-2'>
          <Placeholder as='div' animation='glow' className='d-flex flex-column gap-3'>
            <Placeholder className='h-50 ' />
            <Placeholder className='h-50' />
          </Placeholder>
        </div>
      ) : (
        <div className='d-flex flex-column justify-content-center align-items-center p-2 border'>
          <h4 className='text-center'>No Tweets Yet!</h4>
          <Image src={noTweets} alt='No tweets yet' className='no-tweets' />
        </div>
      )}
    </Container>
  );
}

export default Profile;
