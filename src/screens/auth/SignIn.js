import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { navigate, reset } from '../../utils/navigationRef';
import Constants from '../../utils/Constant';
import { FONTS } from '../../utils/Constant';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios, { setApiToken } from '../../utils/axios';
import { LoadContext, UserContext } from '../../../App';
import Toast from 'react-native-toast-message';
import { User, Lock, Eye, EyeOff, Check, ArrowRight } from "lucide-react-native";
import { setAuthToken } from '../../utils/storage';
import { hp, wp, RF, hpPx, wpPx } from '../../utils/responsiveScreen';

const PRIMARY_GREEN = '#2D6A1E';
const ORANGE_ACCENT = '#E8703A';
const INPUT_BORDER = '#D0D0D0';
const LABEL_COLOR = '#3A3A3A';
const SUBTITLE_COLOR = '#6B6B6B';
const BG_COLOR = '#F4F6F3';
const FOOTER_BG = '#EBEBEB';

const SignIn = () => {
    const [showPass, setShowPass] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useContext(LoadContext);
    const [user, setUser] = useContext(UserContext);

    const validationSchema = Yup.object().shape({
        email: Yup.string().required('Email or username is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    });

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema,
        onSubmit: (values, assets) => submit(values, assets),
    });

    const submit = async (value, { resetForm }) => {
        setLoading(true);
        try {
            const res = await axios.post('auth/login', value);
            setLoading(false);
            if (res.status) {
                setApiToken(res.data.token);
                await setAuthToken(res.data.token);
                setUser(res.data.user);
                resetForm();
                reset('App');
            }
        } catch (err) {
            Toast.show({ type: 'error', text1: err?.message || 'Login failed' });
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG_COLOR }}>
            <StatusBar barStyle="dark-content" backgroundColor={BG_COLOR} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../Assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Card */}
                <View style={styles.card}>
                    <Text style={styles.signInTitle}>Sign In</Text>
                    <Text style={styles.subtitle}>
                        Welcome back to TransiHub. Please enter{'\n'}your details.
                    </Text>

                    {/* Email / Username */}
                    <Text style={styles.fieldLabel}>EMAIL OR USERNAME</Text>
                    <View style={[styles.inputRow, formik.touched.email && formik.errors.email && styles.inputError]}>
                        <User
                            size={RF(16)}
                            color={SUBTITLE_COLOR}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="e.g. traveler@alagare.com"
                            placeholderTextColor="#ABABAB"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={formik.values.email}
                            onChangeText={formik.handleChange('email')}
                            onBlur={formik.handleBlur('email')}
                        />
                    </View>
                    {formik.touched.email && formik.errors.email && (
                        <Text style={styles.errorText}>{formik.errors.email}</Text>
                    )}

                    {/* Password label row */}
                    <View style={styles.passwordLabelRow}>
                        <Text style={styles.fieldLabel}>PASSWORD</Text>
                        <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.inputRow, formik.touched.password && formik.errors.password && styles.inputError]}>
                        <Lock
                            size={RF(16)}
                            color={SUBTITLE_COLOR}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="••••••••"
                            placeholderTextColor="#ABABAB"
                            secureTextEntry={showPass}
                            value={formik.values.password}
                            onChangeText={formik.handleChange('password')}
                            onBlur={formik.handleBlur('password')}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                            {showPass
                                ? <EyeOff size={RF(16)} color={SUBTITLE_COLOR} />
                                : <Eye size={RF(16)} color={SUBTITLE_COLOR} />
                            }
                        </TouchableOpacity>
                    </View>
                    {formik.touched.password && formik.errors.password && (
                        <Text style={styles.errorText}>{formik.errors.password}</Text>
                    )}

                    {/* Remember this device */}
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setRememberMe(!rememberMe)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                            {rememberMe && (
                                <Check
                                    size={RF(11)}
                                    color={Constants.white}
                                />
                            )}
                        </View>
                        <Text style={styles.rememberText}>Remember this device</Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity style={styles.signInBtn} onPress={formik.handleSubmit} activeOpacity={0.85}>
                        <Text style={styles.signInBtnText}>Sign In</Text>
                        <ArrowRight
                            size={RF(15)}
                            color={Constants.white}
                            style={{ marginLeft: wpPx(8) }}
                        />
                    </TouchableOpacity>
                </View>

                {/* Create Account */}
                <View style={styles.createAccountRow}>
                    <Text style={styles.noAccountText}>Don't have an account?  </Text>
                    <TouchableOpacity onPress={() => navigate('SignUp')}>
                        <Text style={styles.createAccountText}>Create an Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerBrand}>
                    <Image
                        source={require('../../Assets/images/logo.png')}
                        style={styles.footerLogo}
                        resizeMode="contain"
                    />
                    <Text style={styles.footerBrandText}>TransiHub by Alagare</Text>
                </View>
                <View style={styles.footerLinks}>
                    <Text style={styles.footerLink}>Privacy Policy</Text>
                    <Text style={styles.footerDot}>  |  </Text>
                    <Text style={styles.footerLink}>Terms of Service</Text>
                    <Text style={styles.footerDot}>  |  </Text>
                    <Text style={styles.footerLink}>Contact Help</Text>
                </View>
                <Text style={styles.footerCopy}>
                    © 2024 Alagare RapidTransit Group. All rights reserved.
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = {
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: hpPx(20),
    },
    logoContainer: {
        alignItems: 'center',
        paddingTop: hp(4),
        paddingBottom: hp(2),
    },
    logo: {
        width: wpPx(140),
        height: wpPx(100),
    },
    card: {
        width: wp(92),
        backgroundColor: Constants.white,
        borderRadius: wpPx(20),
        paddingHorizontal: wp(6),
        paddingVertical: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    signInTitle: {
        fontSize: RF(28),
        fontFamily: FONTS.Bold,
        color: PRIMARY_GREEN,
        textAlign: 'center',
        marginBottom: hpPx(8),
    },
    subtitle: {
        fontSize: RF(13),
        fontFamily: FONTS.Regular,
        color: SUBTITLE_COLOR,
        textAlign: 'center',
        lineHeight: RF(20),
        marginBottom: hp(2.5),
    },
    fieldLabel: {
        fontSize: RF(11),
        fontFamily: FONTS.SemiBold,
        color: LABEL_COLOR,
        letterSpacing: 0.6,
        marginBottom: hpPx(6),
        marginTop: hp(1.5),
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: INPUT_BORDER,
        borderRadius: wpPx(10),
        height: hp(6.5),
        paddingHorizontal: wp(3),
        backgroundColor: '#FAFAFA',
    },
    inputError: {
        borderColor: Constants.red,
    },
    inputIcon: {
        marginRight: wpPx(10),
    },
    textInput: {
        flex: 1,
        fontSize: RF(14),
        fontFamily: FONTS.Regular,
        color: Constants.black,
    },
    eyeBtn: {
        padding: wpPx(6),
    },
    errorText: {
        color: Constants.red,
        fontSize: RF(11),
        fontFamily: FONTS.Medium,
        marginTop: hpPx(4),
        marginLeft: wpPx(4),
    },
    passwordLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp(1.5),
        marginBottom: hpPx(6),
    },
    forgotText: {
        fontSize: RF(12),
        fontFamily: FONTS.SemiBold,
        color: PRIMARY_GREEN,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(2),
        marginBottom: hp(0.5),
    },
    checkbox: {
        width: wpPx(22),
        height: wpPx(22),
        borderWidth: 1.5,
        borderColor: '#9E9E9E',
        borderRadius: wpPx(4),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wpPx(10),
    },
    checkboxChecked: {
        backgroundColor: PRIMARY_GREEN,
        borderColor: PRIMARY_GREEN,
    },
    rememberText: {
        fontSize: RF(13),
        fontFamily: FONTS.Regular,
        color: LABEL_COLOR,
    },
    signInBtn: {
        flexDirection: 'row',
        backgroundColor: PRIMARY_GREEN,
        borderRadius: wpPx(10),
        height: hp(6.5),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(2.5),
        shadowColor: PRIMARY_GREEN,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    signInBtnText: {
        fontSize: RF(16),
        fontFamily: FONTS.SemiBold,
        color: Constants.white,
    },
    createAccountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2.5),
        marginBottom: hp(1),
    },
    noAccountText: {
        fontSize: RF(13),
        fontFamily: FONTS.Regular,
        color: SUBTITLE_COLOR,
    },
    createAccountText: {
        fontSize: RF(13),
        fontFamily: FONTS.SemiBold,
        color: ORANGE_ACCENT,
    },
    footer: {
        backgroundColor: FOOTER_BG,
        alignItems: 'center',
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(4),
        borderTopWidth: 1,
        borderTopColor: '#DCDCDC',
    },
    footerBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hpPx(4),
    },
    footerLogo: {
        width: wpPx(22),
        height: wpPx(22),
        marginRight: wpPx(6),
    },
    footerBrandText: {
        fontSize: RF(12),
        fontFamily: FONTS.SemiBold,
        color: '#4A4A4A',
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hpPx(4),
    },
    footerLink: {
        fontSize: RF(11),
        fontFamily: FONTS.Regular,
        color: '#5A5A5A',
    },
    footerDot: {
        fontSize: RF(11),
        color: '#AAAAAA',
    },
    footerCopy: {
        fontSize: RF(10),
        fontFamily: FONTS.Regular,
        color: '#8A8A8A',
        textAlign: 'center',
    },
};

export default SignIn;
