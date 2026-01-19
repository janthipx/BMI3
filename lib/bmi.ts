export function calculateBmi(weightKg: number, heightM: number): number {
  if (heightM <= 0) throw new Error('invalid height')
  if (weightKg <= 0) throw new Error('invalid weight')
  const bmi = weightKg / (heightM * heightM)
  return Math.round(bmi * 10) / 10
}

export function categorizeBmi(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 23) return 'Normal weight'
  if (bmi < 25) return 'Overweight'
  if (bmi < 30) return 'Obesity level 1'
  return 'Obesity level 2'
}

