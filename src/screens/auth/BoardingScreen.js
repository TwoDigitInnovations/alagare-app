import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

const COLORS = {
    primary: "#4CAF50",
    white: "#FFFFFF",
    light: "#A5D6A7",
};

const slides = [
    {
        id: "1",
        icon: "bank",
        title: "Welcome to Loan EMI Calculator – Finance",
        description:
            "Your complete guide to understanding different types of loans and making informed financial decisions",
    },
    {
        id: "2",
        icon: "compass",
        title: "Explore Loan Types",
        description:
            "Discover personal loans, home loans, car loans, education loans, and business financing options",
    },
    {
        id: "3",
        icon: "lightbulb-on-outline",
        title: "Smart Financial Decisions",
        description:
            "Compare interest rates and understand loan terms to choose the best option for you",
    },
    {
        id: "4",
        icon: "rocket-launch",
        title: "Ready to Get Started?",
        description:
            "Start your journey towards better financial planning and find the perfect loan solution",
    },
];

export default function OnboardingScreen({ navigation }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef();

    const updateIndex = (e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const goNext = () => {
        if (currentIndex < slides.length - 1) {
            ref.current.scrollToIndex({ index: currentIndex + 1 });
        }
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            ref.current.scrollToIndex({ index: currentIndex - 1 });
        }
    };

    const finish = () => {
        navigation.replace("Home"); // Change to your main screen
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={ref}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={updateIndex}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={styles.iconWrapper}>
                            <Icon name={item.icon} size={48} color={COLORS.white} />
                        </View>

                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.desc}>{item.description}</Text>
                    </View>
                )}
            />

            {/* Pagination Dots */}
            <View style={styles.dots}>
                {slides.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            currentIndex === i && styles.activeDot,
                        ]}
                    />
                ))}
            </View>

            {/* Buttons */}
            <View style={styles.footer}>
                {currentIndex > 0 ? (
                    <TouchableOpacity onPress={goPrev}>
                        <Text style={styles.prev}>Previous</Text>
                    </TouchableOpacity>
                ) : (
                    <View />
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={currentIndex === slides.length - 1 ? finish : goNext}
                >
                    <Text style={styles.btnText}>
                        {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    slide: {
        width,
        alignItems: "center",
        padding: 40,
        justifyContent: "center",
    },
    iconWrapper: {
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: 25,
        borderRadius: 80,
        marginBottom: 30,
    },
    title: {
        fontSize: 26,
        color: COLORS.white,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },
    desc: {
        fontSize: 15,
        color: COLORS.light,
        textAlign: "center",
        lineHeight: 22,
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#C8E6C9",
        marginHorizontal: 5,
    },
    activeDot: {
        width: 20,
        backgroundColor: COLORS.white,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingBottom: 30,
    },
    prev: {
        color: COLORS.white,
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 25,
    },
    btnText: {
        color: COLORS.primary,
        fontWeight: "bold",
        fontSize: 16,
    },
});

