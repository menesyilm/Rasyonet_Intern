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
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    code: {
        fontWeight: '700',
        fontSize: 11,
        marginBottom: 3,
    },
    name: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 5,
    },
    text: {
        fontSize: 11,
        marginBottom: 2,
    },
})  
