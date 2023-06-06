import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/authSlice.js'
import axios from '../../utils/axios';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import { Menu } from '../../components';
import 'easymde/dist/easymde.min.css';
import styles from './EditUser.module.scss';

export const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuth = useSelector(selectIsAuth);
    const userData = useSelector((state) => state.auth.data);

    const [isLoading, setIsLoading] = React.useState(true);
    const [previous, setPrevious] = React.useState();
    const [role, setRole] = React.useState('USER');

    const { register, handleSubmit, setError, clearErrors, watch, formState: { errors }, } = useForm({
        mode: 'onSubmit',
    });

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data } = await axios.get(`/users/${id}`);
                setPrevious(data)
            } catch (error) {
                console.error(error.message);
            }
            setIsLoading(false);
        }

        fetchData();
    }, []);

    const handleSelect = (event) => {
        setRole(event.target.value);
    };

    const onSubmit = async (values) => {
        try {
            values = { ...values, role };
            const user = await await axios.patch(`/users/${id}`, values);
            navigate(`/users/${user.data.id}`);

        } catch (error) {
            console.log(error)
            setError('apiError', { type: 'custom', message: error.response.data.message });
        }

    };

    if (!isLoading && userData) {
        if (((!window.localStorage.getItem('token') && !isAuth)
            && ((userData.id !== id) && !userData.admin))) {
            return <Navigate to='/' />
        }
    }

    return (
        <>
            <Grid container spacing={4}>
                <Grid item>
                    <Menu isLoading={false} />
                </Grid>
                <Grid item xs={10} fullWidth>
                    <Paper elevation={3} sx={{ p: '30px', mb: '30px' }}>
                        <Typography classes={{ root: styles.title }} mb={1} variant='h2'>
                            Edit Profile
                        </Typography>

                        {!isLoading && (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Typography variant='body1'>
                                    Previous login:<span style={{ fontWeight: '900' }}> {previous.login}</span>
                                </Typography>
                                <TextField
                                    className={styles.field}
                                    label='Login'
                                    error={Boolean(errors?.login)}
                                    helperText={errors.login?.message}
                                    {...register('login', {
                                        minLength: {
                                            value: 4,
                                            message: "Login must be from 4 to 20 characters"
                                        },
                                        maxLength: {
                                            value: 20,
                                            message: "Login must be from 4 to 20 characters"
                                        },
                                        pattern: {
                                            value: /^\S*$/,
                                            message: "Whitespaces aren't allowed",
                                        }
                                    })}
                                    fullWidth
                                />

                                <Typography variant='body1'>
                                    Previous full name:<span style={{ fontWeight: '900' }}> {previous.full_name}</span>
                                </Typography>
                                <TextField
                                    className={styles.field}
                                    label='Full Name'
                                    error={Boolean(errors?.full_name)}
                                    helperText={errors.full_name?.message}
                                    {...register('full_name', {
                                        minLength: {
                                            value: 4,
                                            message: "Your name must be at least 4 characters"
                                        }
                                    })}
                                    fullWidth
                                />

                                <Typography variant='body1'>
                                    Previous email:<span style={{ fontWeight: '900' }}> {previous.email}</span>
                                </Typography>
                                <TextField
                                    className={styles.field}
                                    label='E-Mail'
                                    type='email'
                                    error={Boolean(errors?.email)}
                                    helperText={errors.email?.message}
                                    {...register('email', {
                                        minLength: {
                                            value: 4,
                                            message: "Email must be at least 4 characters"
                                        },
                                        pattern: {
                                            value: /^\S*$/,
                                            message: "Whitespaces aren't allowed",
                                        }
                                    })}
                                    fullWidth
                                />

                                {userData.admin ?
                                    <>
                                        <FormControl>
                                            <InputLabel>Select user role</InputLabel>
                                            <Select
                                                value={role}
                                                label="Select user role"
                                                onChange={handleSelect}
                                            >
                                                <MenuItem value={'USER'}>USER</MenuItem>
                                                <MenuItem value={'ADMIN'}>ADMIN</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </> : <></>}

                                <TextField
                                    className={styles.field}
                                    label='New Password'
                                    type='password'
                                    error={Boolean(errors?.password)}
                                    helperText={errors.password?.message}
                                    {...register('new_password', {
                                        minLength: {
                                            value: 6,
                                            message: "Password must be from 6 to 22 characters"
                                        },
                                        maxLength: {
                                            value: 22,
                                            message: "Password must be from 6 to 22 characters"
                                        },
                                        pattern: {
                                            value: /^\S*$/,
                                            message: "Whitespaces aren't allowed",
                                        }
                                    })}
                                    fullWidth
                                />
                                <TextField
                                    className={styles.field}
                                    required
                                    label='Password'
                                    type='password'
                                    error={Boolean(errors?.password)}
                                    helperText={errors.password?.message}
                                    {...register('password', {
                                        required: 'Enter password',
                                        minLength: {
                                            value: 6,
                                            message: "Password must be from 6 to 22 characters"
                                        },
                                        maxLength: {
                                            value: 22,
                                            message: "Password must be from 6 to 22 characters"
                                        },
                                        pattern: {
                                            value: /^\S*$/,
                                            message: "Whitespaces aren't allowed",
                                        }
                                    })}
                                    fullWidth
                                />

                                <TextField
                                    className={styles.field}
                                    required
                                    label='Confirm Password'
                                    type='password'
                                    error={Boolean(errors.password_confirmation?.message)}
                                    helperText={errors.password_confirmation?.message}
                                    {...register('password_confirmation', {
                                        required: 'Confirm password',
                                        minLength: {
                                            value: 6,
                                            message: "Password must be from 6 to 22 characters"
                                        },
                                        maxLength: {
                                            value: 22,
                                            message: "Password must be from 6 to 22 characters"
                                        },
                                        pattern: {
                                            value: /^\S*$/,
                                            message: "Whitespaces aren't allowed",
                                        },
                                        validate: (value) => {
                                            if (watch('password') !== value) {
                                                return "Your passwords do no match";
                                            }
                                        }
                                    })}
                                    fullWidth
                                />

                                <div className={styles.buttons}>
                                    <Button onClick={() => clearErrors()} type='submit' size='large' variant='contained'>
                                        Edit
                                    </Button>
                                    <Link to={`/users/${id}`}>
                                        <Button size='large'>Cancel</Button>
                                    </Link>
                                </div>
                                <Typography variant='body1' sx={{ color: 'red' }}>{errors.apiError?.message}</Typography>
                            </form>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>



    );
};
