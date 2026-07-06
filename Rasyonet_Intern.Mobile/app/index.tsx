import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
// ActivityIndicator -> React Web'de loading spinner/component mantığına karşılık gelir.
// StyleSheet        -> React Web'deki CSS/className yerine kullanılır.
import { getCategories } from '@/services/categoryService'
import { Category, Performance } from '@/types/category'
import PerformanceCard from '@/components/performance/PerformanceCard'

export default function IndexScreen() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let isActive = true

        async function loadCategories() {
            try {
                setIsLoading(true)
                setError(null)

                const data = await getCategories()

                if (!isActive) return

                setCategories(data)
            } catch (err) {
                if (!isActive) return

                console.error(err)
                setError('Performans verileri alınamadı.')
            } finally {
                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        loadCategories()

        return () => {
            isActive = false
        }
    }, [])

    const performances = useMemo<Performance[]>(() => {
        return categories.flatMap(category => category.performances ?? [])
    }, [categories])

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Veriler yükleniyor...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Performanslar</Text>

            <FlatList
                data={performances}
                keyExtractor={(item, index) => `${item.uniqueCode}-${index}`}
                renderItem={({ item }) => (
                    <PerformanceCard performance={item} />
                )}
                ListEmptyComponent={
                    <Text>Gösterilecek performans bulunamadı.</Text>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        padding: 16,
        paddingTop: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#16a34a',
        marginBottom: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
})