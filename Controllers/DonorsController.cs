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
    public class DonorsController : ControllerBase
    {
        private BloodBridgeDbContext _dbContext;
        public DonorsController(BloodBridgeDbContext dbContext)
        {
            _dbContext = dbContext; 
        }


        [HttpPost("CompleteProfile")]
        [Authorize(Roles = "Donor")]
        public async Task<IActionResult> CompleteProfile([FromBody]DororDto dto) 
        {
        
            var UserIdString=User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var UsreId=int.Parse(UserIdString);
            var existing = _dbContext.Donors.Any(a => a.UserId == UsreId);
            if (existing) { return BadRequest(); }
            var donor = new Donors
            {
                UserId = UsreId,
                BloodType = dto.BloodType,
                City = dto.City,
                LastDonation = dto.LastDonation.HasValue?DateTime.SpecifyKind(dto.LastDonation.Value,DateTimeKind.Utc):null,
                IsAvailable = dto.LastDonation == null || (DateTime.Now - dto.LastDonation.Value).Days >= 90
            };
            
            _dbContext.Donors.Add(donor);
            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Profile completed successfully" });
        }



        [HttpGet("GetDonor")]
        [Authorize(Roles = "Donor")]
        public async Task<IActionResult> GetDonor()
        {
            var UserIdString = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var UsreId = int.Parse(UserIdString);
            var donor = await _dbContext.Donors.Where(d => d.UserId == UsreId).Select(d => new
            {
                d.Id,
                d.BloodType,
                d.City,
                d.IsAvailable,
                d.LastDonation
            }).FirstOrDefaultAsync();
            if (donor == null) { return NotFound(); }
            return Ok(donor);
        }














        }
}
