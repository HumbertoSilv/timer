import { HandPalm, Play } from 'phosphor-react'
import { HomeContainer, StartButton, StopButton } from './styles'
import { createContext, useState } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { CountDown } from './components/CountDown'
import * as zod from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

const formValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1).max(60),
})

type formData = zod.infer<typeof formValidationSchema>
export const CyclesContext = createContext({} as CyclesContextType)

export const Home = () => {
  const [cycle, setCycle] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

  const newCycleForm = useForm<formData>({
    resolver: zodResolver(formValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycle.find((cycle) => cycle.id === activeCycleId)
  const task = watch('task')

  const handleCreateTask = ({ task, minutesAmount }: formData) => {
    const cycle: Cycle = {
      id: String(new Date().getTime()),
      task,
      minutesAmount,
      startDate: new Date(),
    }

    setCycle((state) => [...state, cycle])
    setActiveCycleId(cycle.id)
    setAmountSecondsPassed(0)
    reset()
  }

  const handleInterruptCycle = () => {
    setCycle(
      cycle.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const markCurrentCycleAsFinished = () => {
    setCycle((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  const setSecondsPassed = (seconds: number) => {
    setAmountSecondsPassed(seconds)
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateTask)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            markCurrentCycleAsFinished,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopButton onClick={() => handleInterruptCycle()} type="button">
            <HandPalm size={24} />
            Parar
          </StopButton>
        ) : (
          <StartButton disabled={!task} type="submit">
            <Play size={24} />
            Começar
          </StartButton>
        )}
      </form>
    </HomeContainer>
  )
}
