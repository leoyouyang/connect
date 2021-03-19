import { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

//Modal
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    background: '#f2f2f2',
    border: 0,
    padding: theme.spacing(5, 5, 5),
    outline: 'none'
  },
}));

const BlueButton = withStyles({
  root: {
    background: '#147ce5',
    '&:hover': {
      background: '#147ce5'
    },
    borderRadius: 30,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 35px',
    margin: '0 10px'
  },
  label: {
    textTransform: 'none',
    fontSize: 20, 
    '@media (max-width: 750px)': {
      fontSize: 16,
    },
  },
})(Button);

const SignUpInput = withStyles({
  root: {
    
  },
  input: {
    color: '#1d1d1f',
    backgroundColor: '#f2f2f2',
    fontFamily: 'Open Sans',
    fontSize: 16,
    border: '1px solid #147ce5',
    borderRadius: 30,
    paddingLeft: 25,
    marginTop: 6,
    marginBottom: 6,
    height: 30
  }
  
})(Input);

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  //User Info
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  //User Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);

      } else {
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  //Sign up
  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
      setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <SignUpInput
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <SignUpInput
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <SignUpInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <center><BlueButton className="SignUpSubmit" type="submit" onClick={signUp}><b>Sign Up</b></BlueButton></center>
        </form>
      </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <SignUpInput
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <SignUpInput
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <center><BlueButton className="SignUpSubmit" type="submit" onClick={signIn}><b>Sign In</b></BlueButton></center>
        </form>
      </div>
      </Modal>

      <div className="app__header">
          <h1>SOME GOOD THINGS</h1>
      </div>

      <div className="app__body">
        <p>It is necessary for us to find glimmers of joy and hope in these difficult times.<br /><br /></p>
        <p>Would you like to post a little good thing here and share what's going on in your life?<br /><br /></p>
      
        {user?.displayName ? (
            <ImageUpload username={user.displayName}/>
          ): (
            <p><br /><br /><center><strong>{user ? (
              <div>Please Refresh the Page to Begin.</div>
            ): (
              <div className="app__loginContainer">
                <BlueButton onClick={() => setOpen(true)}><strong>Sign Up</strong></BlueButton>
                or 
                <BlueButton onClick={() => setOpenSignIn(true)}><strong>Sign In</strong></BlueButton>to Begin
              </div>
            )}</strong></center><br /><br /></p>
        )}
      </div>

      <div className="app__posts">
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
          ))
        }
      </div>
      {user?.displayName ? (
            <center><BlueButton onClick={() => auth.signOut()}><b>Logout</b></BlueButton></center>
          ): (<div>{user ? (<div></div>): (<div></div>)}</div>)}

        <div className="app__footer">2021 Some Good Things.</div>
    </div>
  );
}

export default App;
