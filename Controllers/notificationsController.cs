using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BloodBridge.Model;
using BloodBridge.DTOs;
using BloodBridge.DTOs.AuthDtos;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace BloodBridge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class notificationsController : ControllerBase
    {
        private BloodBridgeDbContext _dbContext;
        public notificationsController(BloodBridgeDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [Authorize]
        [HttpGet("GetNotifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = int.Parse(userIdString);
            var notifications =await _dbContext.Notifications.Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.Id,
                    n.Message,
                    n.CreatedAt,
                    n.IsRead
                }).ToListAsync();
            return Ok(notifications);
        }
        [Authorize]
        [HttpPut("MarkAsRead/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = int.Parse(userIdString);
            var notification = await _dbContext.Notifications.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (notification == null) return NotFound();
            notification.IsRead = true;
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Notification marked as read" });
        }



    }
}
