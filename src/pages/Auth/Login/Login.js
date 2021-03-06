import React, {useState} from 'react';
import { multilanguage } from "redux-multilanguage";
import {Container, Row, Col} from 'react-bootstrap'
import {Link} from 'react-router-dom';
import TextField from '../../../components/UI/TextField/TextField';
import Constant from "../../../utils/constant";
import HookForm from '../../../components/HookForm/HookForm';
import CustomButton from '../../../../src/components/UI/CustomButton/CustomButton';
import Label from '../../../components/UI/Label/Label';

import './Login.scss';

const Login = (props) => {
	
  let { strings } = props;
  const [form, setLoginForm] = useState()
  const [busy, setBusy] = useState(false)
  const [showPass, setShowPass] = useState(false)





  const loginForm = {
    email: {
      name: 'email',
      validate: {
        required: {
          value: true,
          message: strings["EMAILREQUIRED"]
        }, pattern: {
          value: Constant.REGEX.EMAIL,
          message: strings["EMAILINVALID"]
        }
      },
    },
    password: {
      name: 'password',
      validate: {
        required: {
          value: true,
          message: strings["PASSWORDREQUIRED"]
        },
      }
    }
  }



  const onFormSubmit = async (e) => {
    setBusy(true)
    let params = {
      email: e.email,
      password: e.password
    }
    await props.login(params)
      .then((response) => {
        console.log("response", response);
        if (response) {
          const { payload, message } = response;
          const { user, tokens } = payload;
          setTimeout(() => {
            props.initializeSession({ user, tokens });
            props.authenticated();
            setBusy(false)
            props.showToast({
              message: message,
              type: "success"
            });

            if (payload.user.deviceIds.length > 0) {
              // console.log("res.payload.deviceIds.length", payload.user.deviceIds.length);
              props.history.push('/Home')
            }
            else if (response.message != "please verify") {
              props.history.push('/Buydevice')
            }
          }, 2000);
        }
      })


      .catch((err) => {
        setTimeout(() => {
          setBusy(false)
          props.showToast({
            // message: get(err, 'response.data.message', strings["SOMETHING_WENT_WRONG"]),
            type: "error"
          });
        }, 2000);
      })
  }


	return (
		<div className='LoginPage'>
   
    <Container fluid>  
   <Row>
      <div className="logo">
        <img src={Constant.IMAGESURL.LOGO} title="" alt="" />
        </div>
        </Row>

        <Row>
          <Col sm={6}>
            <div className="title">
          <h1>{strings["WELCOME"]}</h1>
          </div>
          </Col>
          <Col className="login-col">
          <div className="sub-title">
            <div className="login-title">{strings["LOGIN"]}</div>
            <div className="login-subtitle">{strings["SUB_TITLE_ONE"]}</div>
              <div className="login-subtitl">{strings["SUB_TITLE_TWO"]}</div>
             
              <HookForm
            defaultForm={{}}
            init={form => setLoginForm(form)}
            onSubmit={(e) => onFormSubmit(e)}
            >
            {(formMethod) => {
              return (
                <>
                  <TextField  
                    formMethod={formMethod}
                    rules={loginForm.email.validate}
                    name={loginForm.email.name}
                   errors={formMethod?.formState?.errors}
                    autoFocus={true}
                    type="text"
                    autoComplete="on"
                    placeholder={strings["EMAILADDRESS"]}
                    className="text-field"
                   

                  />
                  <TextField
                    formMethod={formMethod}
                    rules={loginForm.password.validate}
                    name={loginForm.password.name}
                   errors={formMethod?.formState?.errors}
                    type={showPass ? "text" : "password"}
                    placeholder={strings["PASSWORD"]}
                    iconClass={showPass ? "icon-eye" : "icon-eye-closed"}
                    onIconClick={() => setShowPass(!showPass)}
                    iconRightShow={true}
                    className="text-field"
                  />
                  <div className="custombtnfield">
                    <CustomButton type="submit" title={strings["SIGN_IN"]} disabled={!formMethod?.formState.isValid} loading={busy} />
                  </div>
                  <div className="footerlinks">
<Row>
  <Col>
  <div className='remember'>
                  <input type="checkbox" id="check" name="remember-me" value="remember" className="check-box"/>
                  
                  <Label  title="Remember me" />
                   
                  </div>
  </Col>
  <Col className="forgetlink">
  <Link to="/forgotpassword">{strings["FORGOTPASSWORD"]}</Link>
  </Col>
</Row>
</div>
                
                 
                </>
              )
            }}
          </HookForm>
            </div>
          </Col>
          </Row>
    </Container>
    </div>
	);
}

export default multilanguage(Login);