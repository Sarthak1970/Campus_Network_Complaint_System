package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct{
	DatabaseURL string
	ServerPort string
}

func getEnv(key,fallback string) string{
	if value:=os.Getenv(key); value!=""{
		return value
	}
	return fallback
}

func LoadConfig() Config{
	err:=godotenv.Load()
	if err!=nil{
		fmt.Println("Error in loading env",err)
	}

	return Config{
		DatabaseURL: os.Getenv("DATABASE_URL"),
		ServerPort: getEnv("SERVER_PORT","8080"),
	}
}