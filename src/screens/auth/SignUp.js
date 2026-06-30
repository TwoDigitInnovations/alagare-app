import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { navigate } from '../../utils/navigationRef';
import Constants from '../../utils/Constant';
import { FONTS } from '../../utils/Constant';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from '../../utils/axios';
import Toast from 'react-native-toast-message';
import { LoadContext } from '../../../App';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check } from 'lucide-react-native';
import { hp, wp, RF, hpPx, wpPx } from '../../utils/responsiveScreen';

const PRIMARY_GREEN = '#2D6A1E';
const ORANGE_ACCENT = '#E8703A';
const INPUT_BORDER = '#D0D0D0';
const LABEL_COLOR = '#3A3A3A';
const SUBTITLE_COLOR = '#6B6B6B';
const BG_COLOR = '#F4F6F3';
const FOOTER_BG = '#EBEBEB';

const SignUp = () => {
    const [showPass, setShowPass] = useState(true);
    const [isAgree, setIsAgree] = useState(false);
    const [loading, setLoading] = useContext(LoadContext);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Full name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    });

    const formik = useFormik({
        initialValues: { name: '', email: '', phone: '', password: '' },
        validationSchema,
        onSubmit: (values, helpers) => {
            if (!isAgree) {
                Toast.show({ type: 'error', text1: 'You must accept the Terms of Service and Privacy Policy' });
                return;
            }
            submit(values, helpers);
        },
    });

    const submit = async (value, { resetForm }) => {
        setLoading(true);
        try {
            const res = await axios.post('auth/register', value);
            setLoading(false);
            if (res.status) {
                resetForm();
                setIsAgree(false);
                navigate('SignIn');
                Toast.show({ type: 'success', text1: res.data.message });
            }
        } catch (err) {
            Toast.show({ type: 'error', text1: err?.message || 'Registration failed' });
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Join TransiHub for seamless travel across the Alagare network.
                    </Text>

                    {/* Full Name */}
                    <Text style={styles.fieldLabel}>FULL NAME</Text>
                    <View style={[styles.inputRow, formik.touched.name && formik.errors.name && styles.inputError]}>
                        <User size={RF(16)} color={SUBTITLE_COLOR} style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="John Doe"
                            placeholderTextColor="#ABABAB"
                            value={formik.values.name}
                            onChangeText={formik.handleChange('name')}
                            onBlur={formik.handleBlur('name')}
                        />
                    </View>
                    {formik.touched.name && formik.errors.name && (
                        <Text style={styles.errorText}>{formik.errors.name}</Text>
                    )}

                    {/* Email */}
                    <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
                    <View style={[styles.inputRow, formik.touched.email && formik.errors.email && styles.inputError]}>
                        <Mail size={RF(16)} color={SUBTITLE_COLOR} style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="name@example.com"
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

                    {/* Phone */}
                    <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
                    <View style={[styles.inputRow, formik.touched.phone && formik.errors.phone && styles.inputError]}>
                        <Phone size={RF(16)} color={SUBTITLE_COLOR} style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="+1 (555) 000-0000"
                            placeholderTextColor="#ABABAB"
                            keyboardType="phone-pad"
                            value={formik.values.phone}
                            onChangeText={formik.handleChange('phone')}
                            onBlur={formik.handleBlur('phone')}
                        />
                    </View>
                    {formik.touched.phone && formik.errors.phone && (
                        <Text style={styles.errorText}>{formik.errors.phone}</Text>
                    )}

                    {/* Password */}
                    <Text style={styles.fieldLabel}>PASSWORD</Text>
                    <View style={[styles.inputRow, formik.touched.password && formik.errors.password && styles.inputError]}>
                        <Lock size={RF(16)} color={SUBTITLE_COLOR} style={styles.inputIcon} />
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

                    {/* Terms checkbox */}
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setIsAgree(!isAgree)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, isAgree && styles.checkboxChecked]}>
                            {isAgree && <Check size={RF(11)} color={Constants.white} />}
                        </View>
                        <Text style={styles.termsText}>
                            I agree to the{' '}
                            <Text style={styles.termsLink}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>.
                        </Text>
                    </TouchableOpacity>

                    {/* Sign Up Button */}
                    <TouchableOpacity style={styles.signUpBtn} onPress={formik.handleSubmit} activeOpacity={0.85}>
                        <Text style={styles.signUpBtnText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                {/* Sign In link */}
                <View style={styles.signInRow}>
                    <Text style={styles.alreadyText}>Already have an account?  </Text>
                    <TouchableOpacity onPress={() => navigate('SignIn')}>
                        <Text style={styles.signInLink}>Sign In</Text>
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
    title: {
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
        marginBottom: hp(2),
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
        flexShrink: 0,
    },
    checkboxChecked: {
        backgroundColor: PRIMARY_GREEN,
        borderColor: PRIMARY_GREEN,
    },
    termsText: {
        fontSize: RF(13),
        fontFamily: FONTS.Regular,
        color: LABEL_COLOR,
        flex: 1,
        flexWrap: 'wrap',
    },
    termsLink: {
        fontFamily: FONTS.SemiBold,
        color: PRIMARY_GREEN,
    },
    signUpBtn: {
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
    signUpBtnText: {
        fontSize: RF(16),
        fontFamily: FONTS.SemiBold,
        color: Constants.white,
    },
    signInRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2.5),
        marginBottom: hp(1),
    },
    alreadyText: {
        fontSize: RF(13),
        fontFamily: FONTS.Regular,
        color: SUBTITLE_COLOR,
    },
    signInLink: {
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

export default SignUp;
