import { ChangeEvent, FormEvent, useState } from "react";
import styled from "@emotion/styled";

import Wrapper from "../components/Wrapper";

import { useLoginMutation } from "../generated/graphql";
import { GENERICS } from "../components/GlobalStyle";
import { Link, useNavigate } from "react-router-dom";

const FormWrapper = styled.div`
    display: flex;
    align-items: center;
    border: ${GENERICS.border};
    border-radius: 5px;
    padding: 50px;
    user-select: none;
    gap: 20px;

    > div {
        flex: 0.5;
    }

    .left-side {
        img {
            width: 200px;
        }
    }

    .right-side {
        > div:first-of-type {
            text-align: center;
            margin-bottom: 20px;

            img {
                width: 50px;
                border-radius: 10px;
            }
        }

        form {
            div {
                margin-bottom: 10px;

                input {
                    border: 2px solid gray;
                    border-color: #ccc;
                    border-radius: 5px;
                    padding: 10px 20px;
                    outline: none;
                    transition: 0.5s;

                    &:focus {
                        border-color: blue;
                    }
                }

                button {
                    width: 100%;
                    color: white;
                    background-color: ${({ loading }: { loading: boolean }) =>
                        loading ? "gray" : GENERICS.primaryColor};
                    padding: 8px 20px;
                    border-radius: 5px;
                    cursor: ${({ loading }: { loading: boolean }) =>
                        loading ? "not-allowed" : "pointer"};
                }

                small.error-message {
                    color: red;
                }
            }

            p {
                font-size: 12px;
                a {
                    color: ${GENERICS.primaryColor};
                }
            }
        }
    }
`;

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        error: ""
    });
    const [submitLogin] = useLoginMutation();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.email.trim() === "")
            setFormData({ ...formData, error: "Email is required" });
        else if (formData.password.trim() === "")
            setFormData({ ...formData, error: "Password is required" });
        else {
            try {
                setFormData({ ...formData, error: "" });

                setLoading(true);
                const { data } = await submitLogin({
                    variables: {
                        email: formData.email,
                        password: formData.password
                    }
                });
                setLoading(false);

                if (data?.login.error)
                    setFormData({
                        ...formData,
                        error: data.login.error.message
                    });
                else {
                    navigate("/");
                }
            } catch (error: any) {
                console.error(error);
            }
        }
    };

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <Wrapper center={true}>
            <FormWrapper className="login-container" loading={loading}>
                <div className="left-side">
                    <img
                        src="https://businesstemplates.co.nz/wp-content/uploads/2020/12/login-concept-illustration_114360-739.jpg"
                        alt="login"
                    />
                </div>

                <div className="right-side">
                    <div>
                        <img
                            src="https://www.freeiconspng.com/uploads/evernote-icon-2.png"
                            alt=""
                        />
                        <h2>Nevernote</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleOnChange}
                            />
                        </div>

                        <div>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleOnChange}
                            />
                        </div>

                        {formData.error && (
                            <div>
                                <small className="error-message">
                                    {formData.error}
                                </small>
                            </div>
                        )}

                        <div>
                            <button type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Login"}
                            </button>
                        </div>

                        <p>
                            Don't have an account?{" "}
                            <span>
                                <Link to="/signup">Signup here</Link>
                            </span>
                        </p>
                    </form>
                </div>
            </FormWrapper>
        </Wrapper>
    );
};

export default Login;
