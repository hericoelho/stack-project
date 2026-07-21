function Error({ message }: { message: string }) {
    return (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 mb-6">
          <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
        </div>
    )
}

export default Error