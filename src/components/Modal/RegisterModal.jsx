import ScoreXService from '../../services/ScoreXService';
import { useEffect, useRef, useState } from 'react';
import './RegisterModal.css';
const RegisterModal = ({setLoginRegisterViewState, setModalState, setIsAuthenticated}) => {

  const scoreXService = new ScoreXService();
  const localStorage = window.localStorage;
  const [users, setUsers] = useState([]);

  const [username, setUsername] = useState('');
  const [userNotExists, setUserNotExists] = useState(true);
  const [isUsernameValidated, setIsUsernameValidated] = useState(false);

  const [email, setEmail] = useState('');
  const [emailErrors, setEmailErrors] = useState({
    formatValidation: false,
    emailExists: false,
  });
  const [isEmailValidated, setIsEmailValidated] = useState(false);
  
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    minCharactersValidation: false,
    numberValidation: false,
    upperCaseValidation: false,
    specialCharacterValidation: false
  });
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [arePasswordsEqual, setArePasswordsEqual] = useState(false);

  useEffect(() => {

    scoreXService.getUsers()
      .then((fetchUsers) => {
        setUsers(fetchUsers);
      })
      .catch( err => console.error(err));

  }, []);


  useEffect(() => {

    // Validate Password
    const {minCharactersValidation, numberValidation, upperCaseValidation, specialCharacterValidation} = passwordErrors;
    if(minCharactersValidation && numberValidation && upperCaseValidation && specialCharacterValidation){
      setIsPasswordValidated(true);
    } else{
      setIsPasswordValidated(false);
    }

    // Validate Email
    const {formatValidation, emailExists} = emailErrors;
    if(formatValidation && !emailExists){
      setIsEmailValidated(true);
    } else{
      setIsEmailValidated(false);
    }

  }, [passwordErrors, emailErrors]);



  const handleRegister = (e) => {
    e.preventDefault();

    if(isUsernameValidated && isEmailValidated && isPasswordValidated && arePasswordsEqual){

      const newUser =  {
        name: "",
        surname: "",
        username: username,
        email: email,
        password: password,
        "preferences": [
          {
            "genres": []
          }
        ],
        "following": [],
        "followers": [],
        "games_played": [
        ]
      }

      const loginUser = {
        username: username,
        email: email,
        password: password
      }

      scoreXService.postUser(JSON.stringify(newUser));
      localStorage.setItem('user', JSON.stringify(loginUser));
      setModalState(false);
      setIsAuthenticated(true);
    } else {
      // form not validated correctly, show alert
    }

  }

  
  const handleInputUsername = (e) => {
    const updatedUsername = e.target.value.trim();
    setUsername(updatedUsername);

    let usernameExists = users.find((usr) => usr.username.toLowerCase() === updatedUsername.toLowerCase());

    if(usernameExists){
      setUserNotExists(false);
      setIsUsernameValidated(false);
    } else{
      setUserNotExists(true);
      setIsUsernameValidated(true);
    }
  }

  const handleInputEmail = (e) => {
    const updatedEmail = e.target.value.trim();
    setEmail(updatedEmail);
    validateEmail(updatedEmail);
  }
  
  const handleInputPassword = (e) => {
    const updatedPassword = e.target.value.trim();
    setPassword(updatedPassword);
    validatePassword(updatedPassword);
  }

  const handleInputConfirmPassword = (e) => {
    const updatedConfirmPassword = e.target.value.trim();
    setConfirmPassword(updatedConfirmPassword);
    
    if(updatedConfirmPassword === password){
      setArePasswordsEqual(true);
    } else{
      setArePasswordsEqual(false);
    }
  }

  const validateEmail = (email) => {

    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    let emailExists = users.find((usr) => usr.email.toLowerCase() === email.toLowerCase());

    setEmailErrors({
      formatValidation: regex.test(email),
      emailExists: emailExists ? true : false,
    });
  }

  const validatePassword = (password) => {
    setPasswordErrors({
      minCharactersValidation: password.length >= 8,
      numberValidation: /\d/.test(password),
      upperCaseValidation: /[A-Z]/.test(password),
      specialCharacterValidation: /[^A-Za-z0-9]/.test(password)
    });
  }



  return (
    <div className="registerModal">
      <form onSubmit={handleRegister}>
      <label className='registerLabel'>User</label>
        <input className='registerInput' type="text" value={username} onChange={handleInputUsername} placeholder="Create Username" />
        {userNotExists && username.length > 2 ?
          <p className='passwordValidationText textValidationGreen'>
            <i className='fa-solid fa-check iconCorrect'></i>
            User is available
          </p>
        : !userNotExists && username.length > 2 ?
          <p className='passwordValidationText textValidationRed'>
            <i className='fa-solid fa-xmark iconWrong'></i>
            User already exists
          </p>
        : null
        }
        <label className='registerLabel' >Email</label>
        <input className='registerInput' type="email" value={email} onChange={handleInputEmail} placeholder="example@gmail.com" />
        {Object.entries(emailErrors).map(([key, value]) => (
          <p key={key} className={`passwordValidationText 
            ${value && key === 'formatValidation' ? 'textValidationGreen' : !value && key === 'formatValidation' ? 'textValidationRed' : null}
            ${!value && key === 'emailExists' ? 'textValidationGreen' : value && key === 'emailExists' ?  'textValidationRed' : null}
          `}>
          <i className={`fa-solid 
            ${ value && key === 'formatValidation' ? 'fa-check iconCorrect' : 'fa-xmark iconWrong'}
            ${ !value && key === 'emailExists' ? 'fa-check iconCorrect' : 'fa-xmark iconWrong'}
          `}></i>
          {key === 'formatValidation' && 'Email must have a proper email format'}
          {!value && key === 'emailExists' ? 'Email is available' : value && key === 'emailExists' ? 'Email already exists' : null}
          </p>
        ))}
        <label className='registerLabel' >Password</label>
        <input className="passwordInput registerInput" value={password} onChange={handleInputPassword} type="password" placeholder="Create password" />
        {Object.entries(passwordErrors).map(([key, value]) => (
          <p key={key} className={`passwordValidationText ${ value ? 'textValidationGreen' : 'textValidationRed'}`}>
            <i className={`fa-solid ${ value ? 'fa-check iconCorrect' : 'fa-xmark iconWrong'}`}></i>
            {key === 'minCharactersValidation' && 'Password must contain at least 8 characters'}
            {key === 'numberValidation' && 'Password must contain at least one number'}
            {key === 'upperCaseValidation' && 'Password must contain at least one uppercase letter'}
            {key === 'specialCharacterValidation' && 'Password must contain at least one special character'}
          </p>
        ))}
        <label className='registerLabel' >Confirm Password</label>
        <input className="confirmPasswordInput registerInput" onChange={handleInputConfirmPassword} value={confirmPassword} type="password" placeholder="Repeat password" />
        {arePasswordsEqual && confirmPassword.length >= 8 ?
          <p className='passwordValidationText textValidationGreen'>
            <i className='fa-solid fa-check iconCorrect'></i>
            Passwords are the same
          </p>
        : !arePasswordsEqual && confirmPassword.length >= 8 ?
          <p className='passwordValidationText textValidationRed'>
            <i className='fa-solid fa-xmark iconWrong'></i>
            Passwords have to be the same
          </p>
        : null
        }
        <input className='registerSubmit' type="submit" value="Register" />

      </form>
    </div>
  )
}

export default RegisterModal;