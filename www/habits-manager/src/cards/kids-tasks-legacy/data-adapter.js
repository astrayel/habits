export class DataAdapter {
  static adaptChild(habitsChild) {
    return {
      id: habitsChild.id,
      child_id: habitsChild.id,
      name: habitsChild.name,
      points: habitsChild.points,
      coins: habitsChild.coins,
      level: habitsChild.level,
      avatar: habitsChild.avatar?.photo_url || '👤',
      avatar_type: 'url',
      avatar_data: habitsChild.avatar?.photo_url,
      person_entity_id: habitsChild.person_entity,
      cosmetics: {
        avatar: { emoji: habitsChild.avatar?.customization?.theme || '👤' },
        outfits: [
          habitsChild.avatar?.customization?.clothes,
          habitsChild.avatar?.customization?.accessory,
          habitsChild.avatar?.customization?.pet,
        ].filter(Boolean),
      },
      // Nouveaux champs
      experience: habitsChild.experience,
      experience_to_next_level: habitsChild.experience_to_next_level,
      badges: habitsChild.badges || [],
      owned_cosmetics: habitsChild.owned_cosmetics || [],
    };
  }

  static adaptTask(habitsTask, instances = []) {
    const childInstances = instances.filter(i => i.task_id === habitsTask.id);

    return {
      id: habitsTask.id,
      name: habitsTask.title,
      description: habitsTask.description,
      status: this._mapTaskStatus(childInstances),
      points: habitsTask.rewards?.points || 0,
      coins: habitsTask.rewards?.coins || 0,
      penalty_points: habitsTask.penalties?.points || 0,
      category: habitsTask.category,
      frequency: this._mapFrequency(habitsTask),
      assigned_children: habitsTask.assigned_to || [],
      assigned_child_ids: habitsTask.assigned_to || [],
      active: habitsTask.active,
      icon: habitsTask.icon,
      color: habitsTask.color,
      difficulty: habitsTask.difficulty,
      estimated_duration: habitsTask.estimated_duration,
      completed_at: childInstances[0]?.completed_at,
      validated_at: childInstances[0]?.validated_at,
    };
  }

  static _mapTaskStatus(instances) {
    if (instances.length === 0) return 'todo';
    const latest = instances[instances.length - 1];

    const statusMap = {
      'pending': 'todo',
      'completed_waiting': 'completed',
      'validated': 'validated',
      'refused': 'todo',
      'failed': 'cancelled',
    };

    return statusMap[latest.status] || 'todo';
  }

  static _mapFrequency(habitsTask) {
    if (habitsTask.type === 'bonus') return 'bonus';

    const scheduleMap = {
      'daily': 'daily',
      'weekly': 'weekly',
      'monthly': 'monthly',
      'specific_date': 'none',
    };

    return scheduleMap[habitsTask.schedule?.type] || 'daily';
  }

  static adaptReward(habitsReward) {
    return {
      id: habitsReward.id,
      name: habitsReward.title,
      description: habitsReward.description,
      cost: habitsReward.cost_points,
      coin_cost: habitsReward.cost_coins || 0,
      cost_points: habitsReward.cost_points,
      category: habitsReward.type,
      rarity: null,  // Pas de rareté pour les récompenses réelles
      remaining_quantity: habitsReward.stock,
      min_level: null,  // Géré côté frontend
      icon: habitsReward.icon,
      color: habitsReward.color,
      reward_type: habitsReward.type,
      available: habitsReward.active,
      requires_parent_approval: habitsReward.requires_parent_approval,
      cooldown_days: habitsReward.cooldown_days,
    };
  }

  static adaptCosmetic(habitsCosmetic) {
    return {
      id: habitsCosmetic.id,
      name: habitsCosmetic.name,
      description: habitsCosmetic.description,
      cost: 0,  // Pas de points pour cosmétiques
      coin_cost: habitsCosmetic.cost_coins,
      category: habitsCosmetic.category,
      subcategory: habitsCosmetic.subcategory,
      rarity: habitsCosmetic.rarity,
      remaining_quantity: null,  // Illimité
      min_level: habitsCosmetic.unlock_requirements?.level,
      icon: habitsCosmetic.icon,
      color: habitsCosmetic.color,
      preview_image: habitsCosmetic.preview_image,
      cosmetic_data: {
        category: habitsCosmetic.category,
        subcategory: habitsCosmetic.subcategory,
      },
      reward_type: 'cosmetic',
      available: habitsCosmetic.active,
    };
  }

  static adaptHabit(habitsHabit, streaks = []) {
    const childStreak = streaks.find(s => s.habit_id === habitsHabit.id);

    return {
      id: habitsHabit.id,
      name: habitsHabit.title,
      description: habitsHabit.description,
      icon: habitsHabit.icon,
      color: habitsHabit.color,
      frequency: habitsHabit.frequency,
      points: habitsHabit.rewards?.points || 0,
      coins: habitsHabit.rewards?.coins || 0,
      experience: habitsHabit.rewards?.experience || 0,
      streak_bonus: habitsHabit.rewards?.streak_bonus,
      current_streak: childStreak?.current_streak || 0,
      longest_streak: childStreak?.longest_streak || 0,
      last_completed: childStreak?.last_completed,
      assigned_to: habitsHabit.assigned_to || [],
      active: habitsHabit.active,
    };
  }
}
