
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useCallback } from 'react';
import {
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { RootStackParamList } from '../types/booking';
import { vehicles } from '../types/booking';

type Props = NativeStackScreenProps<RootStackParamList, 'MyVehicle'>;

const vehicleImages = {
    vehicle_1: require('../../assets/cars/nissan_patrol_platinum_2024_8k-original.jpg'),
    vehicle_2: require('../../assets/cars/2026_LandCruiser_HeritageBlue_001.jpg'),
    vehicle_3: require('../../assets/cars/2026_Toyota-Camry_001.jpg'),
    vehicle_4: require('../../assets/cars/BMW X5.jpg'),
    vehicle_5: require('../../assets/cars/mercedes_benz_gle.jpg'),
};

export default function MyVehicleScreen({ navigation }: Props) {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#1D4ED8']}
                    tintColor="#1D4ED8"
                />
            }
        >
            <LinearGradient
                colors={['#111827', '#1D4ED8', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.brandRow}>
                    <View style={styles.brandMark}>
                        <Text style={styles.brandMarkText}>A</Text>
                    </View>
                    <Text style={styles.brand}>AUTOCONX</Text>
                    <View style={styles.inspectionPill}>
                        <Text style={styles.pillText}>INSPECTIONS</Text>
                    </View>
                </View>

                <Text style={styles.headerTitle}>Your next drive,{"\n"}with confidence.</Text>
                <Text style={styles.headerSubtitle}>
                    Select your vehicle and book a professional inspection.
                </Text>

                <View style={styles.headerFooter}>
                    <View>
                        <Text style={styles.count}>{vehicles.length}</Text>
                        <Text style={styles.countLabel}>AVAILABLE VEHICLES</Text>
                    </View>
                    <View style={styles.headerIcon}>
                        <Text style={styles.headerIconText}>↗</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.sectionHeader}>
                <View>
                    <Text style={styles.sectionTitle}>My Vehicles</Text>
                    <Text style={styles.sectionSubtitle}>
                        Choose a vehicle to get started
                    </Text>
                </View>
                <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{vehicles.length}</Text>
                </View>
            </View>

            {
                vehicles.map((vehicle, index) => (
                    <View key={vehicle.id} style={styles.card}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={vehicleImages[vehicle.id as keyof typeof vehicleImages]}
                                style={styles.vehicleImage}
                                resizeMode="cover"
                                accessibilityLabel={`${vehicle.make} ${vehicle.model}`}
                            />
                            <LinearGradient
                                colors={['rgba(15,23,42,0.02)', 'rgba(15,23,42,0.5)']}
                                style={styles.imageShade}
                            />
                            <View style={styles.vehicleNumber}>
                                <Text style={styles.vehicleNumberText}>
                                    {String(index + 1).padStart(2, '0')}
                                </Text>
                            </View>
                            <View style={styles.typePill}>
                                <Text style={styles.typePillText}>{vehicle.bodyType}</Text>
                            </View>
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={styles.year}>{vehicle.year} MODEL</Text>
                            <Text style={styles.vehicleName}>
                                {vehicle.make} {vehicle.model}
                            </Text>
                            <Text style={styles.description}>
                                Professional vehicle inspection
                            </Text>

                            <View style={styles.cardFooter}>
                                <View style={styles.inspectionInfo}>
                                    <View style={styles.checkCircle}>
                                        <Text style={styles.checkText}>✓</Text>
                                    </View>
                                    <Text style={styles.inspectionText}>Ready to inspect</Text>
                                </View>

                                <Pressable
                                    accessibilityRole="button"
                                    accessibilityLabel={`Book inspection for ${vehicle.make} ${vehicle.model}`}
                                    style={({ pressed }) => [
                                        styles.button,
                                        pressed && styles.buttonPressed,
                                    ]}
                                    onPress={() =>
                                        navigation.navigate('BookInspection', { vehicle })
                                    }
                                >
                                    <Text style={styles.buttonText}>Book  →</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                ))
            }

            <View style={styles.bottomNote}>
                <Text style={styles.bottomNoteTitle}>Drive with peace of mind.</Text>
                <Text style={styles.bottomNoteText}>
                    Choose your vehicle above to arrange its inspection.
                </Text>
            </View>

            <Text style={styles.footer}>AUTOCONX · VEHICLE CARE MADE SIMPLE</Text>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F3F6FC',
    },
    container: {
        paddingBottom: 30,
    },
    header: {
        paddingHorizontal: 22,
        paddingTop: 22,
        paddingBottom: 25,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
    },
    brandMark: {
        width: 31,
        height: 31,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandMarkText: {
        color: '#1D4ED8',
        fontSize: 19,
        fontWeight: '900',
    },
    brand: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    inspectionPill: {
        marginLeft: 'auto',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    pillText: {
        color: '#DBEAFE',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.7,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 31,
        lineHeight: 38,
        fontWeight: '900',
        marginTop: 28,
    },
    headerSubtitle: {
        color: '#DBEAFE',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 10,
        maxWidth: 290,
    },
    headerFooter: {
        marginTop: 25,
        paddingTop: 18,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    count: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: '900',
    },
    countLabel: {
        color: '#BFDBFE',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginTop: 3,
    },
    headerIcon: {
        width: 43,
        height: 43,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIconText: {
        color: '#FFFFFF',
        fontSize: 25,
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 15,
    },
    sectionTitle: {
        color: '#101827',
        fontSize: 21,
        fontWeight: '900',
    },
    sectionSubtitle: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 5,
    },
    countBadge: {
        minWidth: 36,
        height: 36,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    countBadgeText: {
        color: '#1D4ED8',
        fontSize: 14,
        fontWeight: '900',
    },
    card: {
        marginHorizontal: 20,
        marginBottom: 17,
        backgroundColor: '#FFFFFF',
        borderRadius: 21,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5EAF3',
        shadowColor: '#0F172A',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    imageContainer: {
        height: 205,
        backgroundColor: '#E8EEF7',
        position: 'relative',
    },
    vehicleImage: {
        width: '100%',
        height: '100%',
    },
    imageShade: {
        ...StyleSheet.absoluteFill,
    },
    vehicleNumber: {
        position: 'absolute',
        top: 13,
        left: 13,
        width: 35,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(15,23,42,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleNumberText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '900',
    },
    typePill: {
        position: 'absolute',
        bottom: 13,
        left: 13,
        borderRadius: 20,
        backgroundColor: 'rgba(15,23,42,0.76)',
        paddingHorizontal: 11,
        paddingVertical: 7,
    },
    typePillText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
    },
    cardContent: {
        padding: 17,
    },
    year: {
        color: '#2563EB',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.4,
    },
    vehicleName: {
        color: '#101827',
        fontSize: 21,
        fontWeight: '900',
        marginTop: 6,
    },
    description: {
        color: '#64748B',
        fontSize: 12,
        marginTop: 5,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 17,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#EDF0F5',
    },
    inspectionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexShrink: 1,
    },
    checkCircle: {
        width: 19,
        height: 19,
        borderRadius: 10,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkText: {
        color: '#15803D',
        fontSize: 12,
        fontWeight: '900',
    },
    inspectionText: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '700',
    },
    button: {
        backgroundColor: '#1D4ED8',
        borderRadius: 11,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '800',
    },
    bottomNote: {
        marginHorizontal: 20,
        marginTop: 4,
        padding: 18,
        borderRadius: 17,
        backgroundColor: '#E8F0FF',
        borderWidth: 1,
        borderColor: '#D6E4FF',
    },
    bottomNoteTitle: {
        color: '#1E3A8A',
        fontSize: 14,
        fontWeight: '800',
    },
    bottomNoteText: {
        color: '#475569',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 5,
    },
    footer: {
        color: '#94A3B8',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 1,
        textAlign: 'center',
        marginTop: 23,
    },
});
