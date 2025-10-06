"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowDownUp, TrendingUp, DollarSign, Loader2 } from "lucide-react"

// Popular currencies with their symbols
const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
]

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // Fetch exchange rates and convert
  useEffect(() => {
    const convertCurrency = async () => {
      if (!amount || Number.parseFloat(amount) <= 0) {
        setConvertedAmount(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Using exchangerate-api.com (free tier)
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates")
        }

        const data = await response.json()
        const rate = data.rates[toCurrency]

        if (!rate) {
          throw new Error("Exchange rate not available")
        }

        setExchangeRate(rate)
        const result = Number.parseFloat(amount) * rate
        setConvertedAmount(result)
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setConvertedAmount(null)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      convertCurrency()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [amount, fromCurrency, toCurrency])

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const getFromCurrencyData = () => currencies.find((c) => c.code === fromCurrency)
  const getToCurrencyData = () => currencies.find((c) => c.code === toCurrency)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-balance bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Currency Converter
          </h1>
          <p className="text-muted-foreground text-lg">Real-time exchange rates at your fingertips</p>
        </div>

        {/* Main Converter Card */}
        <Card className="p-8 shadow-2xl border-2 backdrop-blur-sm bg-card/95">
          <div className="space-y-6">
            {/* From Currency Section */}
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-base font-semibold">
                Amount
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl h-14 pr-20 font-semibold"
                  min="0"
                  step="0.01"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl">{getFromCurrencyData()?.flag}</div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="from-currency" className="text-base font-semibold">
                From
              </Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="from-currency" className="h-14 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-base">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{currency.flag}</span>
                        <span className="font-semibold">{currency.code}</span>
                        <span className="text-muted-foreground">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSwapCurrencies}
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-110 bg-transparent"
              >
                <ArrowDownUp className="h-5 w-5" />
              </Button>
            </div>

            {/* To Currency Section */}
            <div className="space-y-3">
              <Label htmlFor="to-currency" className="text-base font-semibold">
                To
              </Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="to-currency" className="h-14 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-base">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{currency.flag}</span>
                        <span className="font-semibold">{currency.code}</span>
                        <span className="text-muted-foreground">{currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Result Display */}
            <div className="mt-8 p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 rounded-2xl border-2 border-primary/20">
              {loading ? (
                <div className="flex items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-lg">Converting...</span>
                </div>
              ) : error ? (
                <div className="text-center text-destructive">
                  <p className="text-lg font-semibold">{error}</p>
                </div>
              ) : convertedAmount !== null ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Converted Amount</p>
                    <p className="text-4xl font-bold text-balance">
                      {getToCurrencyData()?.symbol}{" "}
                      {convertedAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  {exchangeRate && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border/50">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                      </span>
                    </div>
                  )}

                  {lastUpdated && (
                    <p className="text-xs text-center text-muted-foreground">Last updated: {lastUpdated}</p>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p className="text-lg">Enter an amount to convert</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold text-primary">15+</div>
            <div className="text-sm text-muted-foreground">Currencies</div>
          </Card>
          <Card className="p-4 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold text-secondary">Real-time</div>
            <div className="text-sm text-muted-foreground">Exchange Rates</div>
          </Card>
          <Card className="p-4 text-center hover:shadow-lg transition-shadow">
            <div className="text-2xl font-bold text-primary">Instant</div>
            <div className="text-sm text-muted-foreground">Conversion</div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by real-time exchange rate data • Built with React & Next.js</p>
        </div>
      </div>
    </div>
  )
}
