import { View, Text, StyleSheet } from 'react-native'
import { Performance } from '@/types/category'

type Props = {
    performance: Performance
}

export default function PerformanceCard({ performance }: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.code}>Kod: {performance.uniqueCode}</Text>
            <Text style={styles.name}>Ad: {performance.performanceName}</Text>
            <Text style={styles.text}>Fiyat: {performance.price}</Text>
            <Text style={styles.text}>Günlük: %{performance.dailyChange}</Text>
            <Text style={styles.text}>Haftalık: %{performance.weeklyChange}</Text>
            <Text style={styles.text}>Aylık: %{performance.monthlyChange}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    code: {
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        marginBottom: 3,
    },
})  