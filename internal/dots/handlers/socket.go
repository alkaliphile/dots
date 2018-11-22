package handlers

import (
	"log"
	"net/http"

	"github.com/labstack/echo"
)

// Socket handler
func Socket(c echo.Context) error {

	log.Println("handler")

	return c.NoContent(http.StatusOK)
}
