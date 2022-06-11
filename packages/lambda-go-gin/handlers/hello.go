package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type helloResponse struct {
	Message string
}

func HelloHandler(c *gin.Context) {
	res := helloResponse{"Hello, World"}
	json_data, err := json.Marshal(res)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{})
		return
	}
	c.String(http.StatusOK, string(json_data))
}
