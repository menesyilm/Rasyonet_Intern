import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PieChart, pieDataItem } from 'react-native-gifted-charts';
import { isAuthRequiredError } from '@/services/categoryService';
import { getStoreLocationSalesChart } from '@/services/salesChartService';
import { useAuthSession } from '@/services/authSession';
import { StoreLocationSalesChartItem } from '@/types/salesChart';

const CHART_COLORS = [
    '#5d74f1',
    '#ad78ea',
    '#66a7e8',
    '#2fbd74',
    '#f6dc3e',
    '#b9c8ec',
    '#e76200',
    '#aab2bd',
];

type LegendItem = StoreLocationSalesChartItem & {
    color: string;
    percentage: number;
};

type PieLabel = {
    id: string;
    text: string;
    left: number;
    top: number;
    align: 'left' | 'right' | 'center';
};

type ChartViewMode = 'pie' | 'table';

export default function ChartsScreen() {
    const router = useRouter();
    const { signOut } = useAuthSession();
    const { width } = useWindowDimensions();
    const [items, setItems] = useState<StoreLocationSalesChartItem[]>([]);
    const [viewMode, setViewMode] = useState<ChartViewMode>('pie');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasHandledSessionExpiredRef = useRef(false);

    const handleSessionExpired = useCallback(() => {
        if (hasHandledSessionExpiredRef.current) {
            return;
        }

        hasHandledSessionExpiredRef.current = true;
        void signOut('Giriş süreniz doldu. Lütfen tekrar giriş yapınız.');
    }, [signOut]);

    useEffect(() => {
        let isActive = true;

        async function loadChart() {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getStoreLocationSalesChart();

                if (!isActive) return;

                setItems(data);
            } catch (err) {
                if (!isActive) return;

                if (isAuthRequiredError(err)) {
                    handleSessionExpired();
                    return;
                }

                console.error(err);
                setError('Chart verileri alınamadı.');
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        loadChart();

        return () => {
            isActive = false;
        };
    }, [handleSessionExpired]);

    function handleViewModeChange(nextMode: ChartViewMode) {
        setViewMode(nextMode);
    }

    const legendItems = useMemo<LegendItem[]>(() => {
        const total = items.reduce((sum, item) => sum + item.totalSales, 0);

        if (total <= 0) {
            return [];
        }

        return items.map((item, index) => ({
            ...item,
            color: CHART_COLORS[index % CHART_COLORS.length],
            percentage: (item.totalSales / total) * 100,
        }));
    }, [items]);

    const pieData = useMemo<pieDataItem[]>(() => {
        return legendItems.map(item => ({
            value: item.totalSales,
            color: item.color,
        }));
    }, [legendItems]);

    const chartRadius = Math.min(92, Math.max(76, (width - 112) / 4));
    const labelWidth = 42;
    const labelHeight = 12;
    const labelDistance = chartRadius + 22;
    const chartFrameSize = chartRadius * 2 + 92;
    const chartCenter = chartFrameSize / 2;

    const pieLabels = useMemo<PieLabel[]>(() => {
        let cumulativePercentage = 0;

        return legendItems.map(item => {
            const midPercentage = cumulativePercentage + item.percentage / 2;
            cumulativePercentage += item.percentage;

            const angle = ((midPercentage / 100) * 360 - 90) * (Math.PI / 180);
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            const isRightSide = x > 0.18;
            const isLeftSide = x < -0.18;
            const align = isRightSide ? 'left' : isLeftSide ? 'right' : 'center';
            const horizontalOffset = isRightSide ? 0 : isLeftSide ? labelWidth : labelWidth / 2;

            return {
                id: item.storeLocation,
                text: `%${formatPercentage(item.percentage)}`,
                left: chartCenter + x * labelDistance - horizontalOffset,
                top: chartCenter + y * labelDistance - labelHeight / 2,
                align,
            };
        });
    }, [chartCenter, labelDistance, legendItems]);

    const storeLocationTotals = useMemo(() => {
        return items.reduce(
            (totals, item) => ({
                totalSales: totals.totalSales + item.totalSales,
                orderCount: totals.orderCount + item.orderCount,
            }),
            { totalSales: 0, orderCount: 0 },
        );
    }, [items]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Chart verileri yükleniyor...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.page}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.panel}>
                <View style={styles.chartHeader}>
                    <View style={styles.actionsRow}>
                        <Pressable
                            style={[
                                styles.iconButton,
                                viewMode === 'pie' && styles.iconButtonActive,
                            ]}
                            onPress={() => handleViewModeChange('pie')}
                        >
                            <MaterialCommunityIcons
                                name="chart-pie"
                                size={18}
                                color={viewMode === 'pie' ? '#26b36c' : '#6b7280'}
                            />
                        </Pressable>
                        <Pressable
                            style={[
                                styles.iconButton,
                                viewMode === 'table' && styles.iconButtonActive,
                            ]}
                            onPress={() => handleViewModeChange('table')}
                        >
                            <MaterialCommunityIcons
                                name="table"
                                size={18}
                                color={viewMode === 'table' ? '#2563eb' : '#6b7280'}
                            />
                        </Pressable>
                    </View>
                </View>

                {viewMode === 'table' ? (
                    <StoreLocationTable
                        items={legendItems}
                        totals={storeLocationTotals}
                    />
                ) : error ? (
                    <View style={styles.stateBlock}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : legendItems.length === 0 ? (
                    <View style={styles.stateBlock}>
                        <Text style={styles.emptyText}>Gösterilecek chart verisi bulunamadı.</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.chartArea}>
                            <View
                                style={[
                                    styles.chartFrame,
                                    {
                                        width: chartFrameSize,
                                        height: chartFrameSize,
                                    },
                                ]}
                            >
                                <PieChart
                                    data={pieData}
                                    radius={chartRadius}
                                    strokeWidth={0}
                                    initialAngle={0}
                                    isAnimated
                                    animationDuration={650}
                                    paddingHorizontal={0}
                                    paddingVertical={0}
                                />

                                {pieLabels.map(label => (
                                    <Text
                                        key={label.id}
                                        style={[
                                            styles.pieLabel,
                                            {
                                                left: label.left,
                                                top: label.top,
                                                width: labelWidth,
                                                textAlign: label.align,
                                            },
                                        ]}
                                    >
                                        {label.text}
                                    </Text>
                                ))}
                            </View>
                        </View>

                        <View style={styles.legend}>
                            {legendItems.map(item => (
                                <View key={item.storeLocation} style={styles.legendRow}>
                                    <View style={styles.legendLabel}>
                                        <View
                                            style={[
                                                styles.legendDot,
                                                { backgroundColor: item.color },
                                            ]}
                                        />
                                        <Text
                                            style={styles.legendText}
                                            numberOfLines={1}
                                        >
                                            {item.storeLocation}
                                        </Text>
                                    </View>
                                    <Text style={styles.legendValue}>
                                        %{formatPercentage(item.percentage)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Performans sayfasına dön</Text>
                </Pressable>
            </View>
        </ScrollView >
    );
}

type StoreLocationTableProps = {
    items: LegendItem[];
    totals: {
        totalSales: number;
        orderCount: number;
    };
};

function StoreLocationTable({
    items,
    totals,
}: StoreLocationTableProps) {
    if (items.length === 0) {
        return (
            <View style={styles.stateBlock}>
                <Text style={styles.emptyText}>Gösterilecek tablo verisi bulunamadı.</Text>
            </View>
        );
    }

    return (
        <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <Text style={[styles.tableHeaderText, styles.methodCell]}>Mağaza Lokasyonu</Text>
                <Text style={[styles.tableHeaderText, styles.salesCell]}>Toplam Satış</Text>
                <Text style={[styles.tableHeaderText, styles.orderCell]}>Sipariş Sayısı</Text>
            </View>

            {items.map(item => {
                const orderPercentage =
                    totals.orderCount > 0
                        ? (item.orderCount / totals.orderCount) * 100
                        : 0;

                return (
                    <View key={item.storeLocation} style={styles.tableRow}>
                        <Text style={[styles.tableCellText, styles.methodCell]} numberOfLines={1}>
                            {item.storeLocation}
                        </Text>
                        <Text style={[styles.tableCellText, styles.salesCell]}>
                            {formatCurrency(item.totalSales)}
                        </Text>
                        <Text style={[styles.tableCellText, styles.orderCell]}>
                            {item.orderCount} (%{formatPercentage(orderPercentage)})
                        </Text>
                    </View>
                );
            })}

            <View style={[styles.tableRow, styles.totalRow]}>
                <Text style={[styles.totalText, styles.methodCell]}>Toplam</Text>
                <Text style={[styles.totalText, styles.salesCell]}>
                    {formatCurrency(totals.totalSales)}
                </Text>
                <Text style={[styles.totalText, styles.orderCell]}>
                    {totals.orderCount}
                </Text>
            </View>
        </View>
    );
}

function formatPercentage(value: number) {
    return value.toFixed(2);
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(value);
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 24,
    },
    panel: {
        borderWidth: 1,
        borderColor: '#edf0f4',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        padding: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    segmentedControl: {
        minHeight: 32,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#f2f4f8',
        padding: 2,
    },
    activeSegment: {
        flex: 1,
        minHeight: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        backgroundColor: '#ffffff',
    },
    inactiveSegment: {
        flex: 1,
        minHeight: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeSegmentText: {
        color: '#17a868',
        fontSize: 12,
        fontWeight: '700',
    },
    inactiveSegmentText: {
        color: '#929bab',
        fontSize: 12,
        fontWeight: '600',
    },
    chartHeader: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        gap: 12,
        marginBottom: 12,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 4,
    },
    iconButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#ffffff',
    },
    iconButtonActive: {
        backgroundColor: '#f0f1f4',
    },
    chartArea: {
        minHeight: 206,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 6,
        paddingBottom: 4,
    },
    chartFrame: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieLabel: {
        position: 'absolute',
        color: '#111827',
        fontSize: 10,
        fontWeight: '700',
    },
    table: {
        marginTop: 8,
    },
    tableRow: {
        minHeight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#dfe3ea',
        paddingHorizontal: 8,
        gap: 5,
    },
    tableHeaderRow: {
        minHeight: 38,
    },
    tableHeaderText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: '700',
    },
    tableCellText: {
        color: '#53667f',
        fontSize: 11,
    },
    methodCell: {
        flex: 1.05,
        textAlign: 'left',
    },
    salesCell: {
        flex: 1.1,
        textAlign: 'right',
    },
    orderCell: {
        flex: 1,
        textAlign: 'right',
    },
    totalRow: {
        minHeight: 34,
        borderBottomWidth: 0,
        backgroundColor: '#505050',
    },
    totalText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '800',
    },
    legend: {
        marginTop: 2,
    },
    legendRow: {
        minHeight: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        gap: 8,
    },
    legendLabel: {
        flex: 1,
        minWidth: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        flex: 1,
        minWidth: 0,
        color: '#1f2937',
        fontSize: 11,
    },
    legendValue: {
        minWidth: 44,
        color: '#111827',
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'right',
    },
    backButton: {
        minHeight: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#16a34a',
        marginTop: 10,
    },
    backButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#ffffff',
    },
    stateBlock: {
        minHeight: 260,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    errorText: {
        color: '#dc2626',
        fontSize: 14,
        textAlign: 'center',
    },
    emptyText: {
        color: '#6b7280',
        fontSize: 14,
        textAlign: 'center',
    },
});
